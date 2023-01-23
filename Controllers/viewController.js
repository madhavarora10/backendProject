
const Tour=require('../models/tourModel');
const User=require('../models/userModel');
const catchAsync=require('../utils/catchAsync');


exports.getOverview= catchAsync(async(req,res,next)=>{
    //1) Get tour data from collection
    const tours =await Tour.find(); 

    //2 build templates

    //3) render that templates using tour data from 1)
    res.status(200).render('overview',{
        title:'All Tours',
        tours
    });

});

exports.getTour=catchAsync(async(req,res)=>{
    //1 get the data for the requested tour(including reviews and guides)
    const tour= await Tour.findOne({name:req.params.name}).populate({
        path:'reviews',
        fields:'review rating user'

    });
    res.status(200).render('tour',{
        title:`${tour.name} Tour`,
        tour

    });

});


exports.getLoginForm=(req,res)=>{
    res.status(200).render('login',{
        title:'Log into your account'
    });
};
exports.getAccount=(req,res)=>{
    res.status(200).render('account',{
        title:'Your account'
    });
};


// exports.updateUserData=catchAsync(async(req,res,next)=>{
// const user=await User.findByIdAndUpdate(
//     req.user.id,
//     {
//     name:req.body.name,
//     email:req.body.email

//     },
//     {
//         new:true,
//         runValidators:true
//     }
// );

// res.status(200).render('account',{
//title:'your account'
//user:updateUser
// });
// });