const AppError=require('./..//utils/appError');
const handleCastErrorDB=err=>{
    const message=`Invalid ${err.path}:${err.value}`;
    return new AppError(message,400);

};
const handleDuplicateFieldsDB=err=>{
    const value=err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message=`Duplicate message ${value}`;
    return new AppError(message,400);

};

const handleValidationErrorDB=err=>{
    const errors=Object.values(err.errors).map(el=>el.message);

    const message=`Invalid input data. ${errors.join('. ')};`
    return new AppError(message,400);

};

const handleJWTERROR=()=>new AppError('Invalid token',401);
const handleJWTExpiredError=()=>new AppError('token expired',401);

const sendErrorDev=(err,res)=>{
    res.status(err.statusCode).json({
        status: err.status,
         message: err.message,
         error:err,
         stack:err.stack
    });
};


const sendErrorProd=(err,res)=>{
    //Operational,trusted error:send message to client
    if(err.isOperational){
        res.status(err.statudsCode).json({
            status:err.status,
            message:err.message
        });
        //Programming or orther unknown error :dont leak error details
    } else{
        //1) Log error
        console.error('Error',err);
        //20 send generic message
        res.status(500).json({
            status:'error',
            message:'Something Went Wrong'
        });

    }

};
module.exports=(err,req,res,next)=>{

    err.statusCode=err.statudsCode||300;
    err.status=err.status||'error';

    if(process.env.NODE_ENV==='development'){
        sendErrorDev(err,res);
    } else if(process.env.NODE_ENV==='production'){
        let error ={...err};

        if(error.name==='CastError') error=handleCastErrorDB(error);
        sendErrorProd(error,res);

        if(error.code===11000) error=handleDuplicateFieldsDB(error);

        if(error.name=='ValidationError')
        error=handleValidationErrorDB(error);

        if(error.name==='JsonWebTokenError') error=handleJWTERROR();

        if(error.name==='TokenExpiredError')
        error=handleJWTExpiredError();


        sendErrorProd(error,res);
    }

};