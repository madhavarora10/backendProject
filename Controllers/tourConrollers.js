 const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
//  const APIFeatures = require('./../utils/apiFeatures');
const catchAsync= require('./../utils/catchAsync');
const factory=require('./handleControllers');



 // const fs =require('fs');

  // const tours=JSON.parse(
  //     fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
  //    );
   
   // here it will send parsed json when ever there is a request for this URL


//    exports.checkId=(req,res,next,val)=>{
//     console.log('tour id');

//     // if(req.param.id*1>tours.length){
//     //     return res.status(404).json({
//     //         status:'fail',
//     //         message:'invalid id'
//     //     });

//     //}
    
//     next();

// };

//19. chaining multiple middleware (chainging checkBody and createTour)
 //checkbody will  first check whether request has a valid name and price

//  exports.checkBody=(req,res,next)=>{
//     if(!req.body.name|| !req.body.price){
//         return res.status(400).json({
//             status:'fail',
//             message:'missing name or price'
//         })
//     }
//     next();
// };



exports.aliasTopTours=(req,res,next)=>{
    req.query.limit='5';
    req.query.sort='-ratingAverage,price';
    req.query.fields='name,price,ratingAverage';

    next();

};

//  exports.getallTours= async(req,res)=>{
//     try{
//         const queryObj={...req.query};
//         const excludeFields=['page','sort','limit','fields'];
//         excludeFields.forEach(el=> delete queryObj[el]);
        
        

        
//         //advance filtering
//         let queryStr=JSON.stringify(queryObj);
//         queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`);
//         console.log(JSON.parse(queryStr));

        
//         let query=  Tour.find(JSON.parse(queryStr));

//        // Sorting
//         if(req.query.sort){
//             const sortBy= req.query.sort.split(',').join(' ');
//             console.log(sortBy);
//             query=query.sort(sortBy);
//         }
//         // else{
//         //     query=query.sort('-createAt');
//         // }

//         //pagig showing less  info to user
//         if(req.query.fields){
//             const fields= req.query.fields.split(',').join(' ');
//             query=query.select(fields);
//         }
//         else{
//             query=query.select('-__v');
//         }

//         //advance pagination
//         const page=req.query.page*1 || 1;
//         const limit =req.query.limit*1 || 100;
//         const skip=(page-1)*limit;


//         query=query.skip(skip).limit(limit);

//         if(req.query.page){
//             const numTours= await Tour.countDocuments();
//             if(skip>=numTours) throw new Error('this page does not exist');
//         }
//         //Execute Query
//         const tours =await query;



//  exports.getallTours= catchAsync(async(req,res,next)=>{
   
//         //execute query
//         const features = new APIFeatures(Tour.find(), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();
//       const tours = await features.query;

//         //send response 
//         res.status(200).json({
//             status:'status',
//             results: tours.length,
//             //this is called envloping of data to send to the request it is stored inside the object
//              data:{
//                   tours
//                 // here second tours refers to the parsed upar const wala jisme parsed simple.json hai tours
//             }
//         });
    
    
      
//   });




// exports.createtour = catchAsync(async(req,res,next)=>{
//     //creating a new id for newly created input
//     // const newID=tours[tours.length -1]+1;
//     // const newTour =Object.assign({id:newId},req.body);
//     //  /// here adding new created input in our file based data
//     // tours.push(newTour);
   
//        // converting tours object into string
//      //   JSON.stringify(tours),

   
//         const newTour=await Tour.create(req.body);  
//         res.status(201).json({
//             status :'success',
            
//             data:{
//                 tour: newTour
//             }
//          });
       

    
// });




// exports.getTour=catchAsync(async(req,res,next)=>{
    
//     // const id =req.params.id *1;
//     // const tour=tours.find(el=>el.id===id)
//     // if(!tour){

    

//         const tour =await Tour.findById(req.params.id).populate('reviews');
//         //Tour.findOne({_id:req.param.id})
//         if(!tour){
//             return next(new AppError('No tour found with this id',404))
//         }

//         res.status(200).json({
//             status:'sucess',
//             data: {
//                 tour
//             }
            
//         });
        
   
// });


// exports.updatetour= catchAsync(async(req,res,next)=>{

//         const tour =await Tour.findByIdAndUpdate(req.params.id,req.body,{
//             new:true,
//             runValidators:true
//         });
//         if(!tour){
//             return next(new AppError('No tour found with this id',404))
//         }

//         res.status(200).json({
//             status:'success',
//             data:{
//                 tour
//             }
            
//         });

// });  

// exports.deleteTour=catchAsync(async(req,res,next)=>{
//     const tour=await Tour.findByIdAndDelete(req.params.id);

//     if(!tour){
//         return next(new AppError('No tour found with this id',404))
//     }

//         res.status(204).json({
//             status:'success',
//             data:null
    
//         });
// });


exports.getTour = factory.getOne(Tour, { path: 'reviews',options: {strictPopulate: false} });
exports.getallTours=factory.getAll(Tour);
exports.deleteTour=factory.deleteOne(Tour);
exports.createtour=factory.CreateOne(Tour);
exports.updatetour=factory.updateOne(Tour);





exports.getTourStats = catchAsync(async (req, res,next) => {
    
      const stats = await Tour.aggregate([
        {
          $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
          $group: {
            _id: { $toUpper: '$difficulty' },
            numTours: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        },
        {
          $sort: { avgPrice: 1 }
        }
        // {
        //   $match: { _id: { $ne: 'EASY' } }
        // }
      ]);
  
      res.status(200).json({
        status: 'success',
        data: {
          stats
        }
      });
    
  });

exports.getMonthlyPlan =catchAsync(async(req,res,next)=>{

   
        const year= req.params.year*1;
        const plan =await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            {
                $match:{
                    startDates:{
                        $gte:new Date(`${year}-01-01`),
                        $lte:new Date(`${year}-01-31`)

                    }
                }
            },
            {
                $group:{
                    _id:{$month:'$startDates'},
                    numTourStarts:{$sum:1},
                    tours:{$push:'$name'}
                }
            },
            {
                $addFields:{
                    month:'$_id'
                }
            },
            {
                $project:{
                    _id:0
                }
            },
            {
                $sort:{
                    numTourStarts:-1
                }
            }

        ]);

        res.status(200).json({
            status:'success',
            data:{
                plan
            }
    
        });

  

});

///tours-within/:distance/center/:latlng/unit/:unit
///tours-within/:233/center/:-40,45/unit/:mi
exports.getTourWithin=catchAsync(async(req,res,next)=>{
    const {distance,latlng,unit}=req.params;
    const [lat,lng]=latlng.split(',');
                                //EARTH RADIUS
    const radius=unit=='mi'?distance/3963.2:distance/6378.1;

    if(!lat||!lng){
        next(new AppError(
            'please provide latitude andlongitude',400
        )
        );
    }
const tours =await Tour.find({
startLocation:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}
});

res.status(200).json({
    status:'success',
    result:tours.length,
    data:{
        data:tours
    }
});
});


