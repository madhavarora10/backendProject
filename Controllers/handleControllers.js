const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne=Model=>
catchAsync(async(req,res,next)=>{
    const doc=await Model.findByIdAndDelete(req.params.id);
    if(!doc){
        return next(new AppError('No doc found',404));

    }
    res.status(204).json({
        status:'success',
        data:null
    });

});

exports.updateOne=Model=>
catchAsync(async(req,res,next)=>{
    const doc=await Model.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true

    });
    if(!doc){
        return next(new AppError('No docc found',404));
    }
    res.status(200).json({
        status:'success',
        data:{
            data:doc
        }
    });

});

exports.CreateOne=Model=>
catchAsync(async(req,res,next)=>{
    const doc=await Model.create(req.body);


    res.status(201).json({
        status:'success',
        dat:{
            data:doc
        }
    });
});

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });


exports.getAll=Model=>
catchAsync(async(req,res,next)=>{
    //to allow for nested GET reviews on tour

    let filter={};
    if(req.params.tourId) filter={tour:req.params.tourId};

    
    const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

    //send response 
    res.status(200).json({
        status:'status',
        results: doc.length,
        //this is called envloping of data to send to the request it is stored inside the object
         data:{
             data: doc
            // here second tours refers to the parsed upar const wala jisme parsed simple.json hai tours
        }
    });


  
});


