const User=require('./../models/userModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const factory=require('./handleControllers');
const multer=require('multer');


const multerStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/img/users')
    },
    filename:(req,file,cb)=>{
        const ext=file.mimetype.split('/')[1];
        cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
    }
});

const multerFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }else{
        cb(new AppError('Not an image',400),false);
    }
};

const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
});

exports.uploadUserPhoto=upload.single('photo');

const filterObj=(obj,...allowedFields)=>{
    const newObj={};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el]=obj[el];
    });
    return newObj;

};
exports.getMe=catchAsync(async(req,res,next)=>{
    req.params.id=req.user.id;
    next();
});

exports.updateMe=catchAsync(async(req,res,next)=>{
    //1) create error if user posts password data
    if(req.body.password||req.passwordConfirm){
        return next(
            new AppError('this route is not for password updates.',400)
        );
    }

    //2) Update User document
    const filteredBody=filterObj(req.body,'name','email');
    const updateUser=await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new:true,
        runValidators:true
    });

    res.status(200).json({
        status:'success',
        data:{
            user:updateUser
        }

    });
});


exports.deleteMe=catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false})

    res.status(204).json({
        status:'success',
        data:null 

    });

});

exports.getUser=factory.getOne(User);
exports.getAllUsers= factory.getAll(User);

//Do not update password with it
exports.deleteUser=factory.deleteOne(User);
exports.updateUser=factory.updateOne(User);