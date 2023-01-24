
const path = require('path');
const express= require('express');
var cors = require('cors');
const session=require('express-session');
const globalErrorHandler=require('./Controllers/errorController');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const tourRouter=require('./routes/tourRoutes');
const userRouter=require('./routes/userRoutes');
const reviewsRouter=require('./routes/reviewsRouter');
const AppError=require('./utils/appError');
const mongoSanitize = require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const cookieParser=require('cookie-parser');
const viewRouter=require('./routes/viewRoutes');

const compression=require('compression');  


// express is a function upon which calling will add bunch of methods on app
const app= express();
app.use(cors());
app.use(session({
    allowedHeaders: ['sessionId', 'Content-Type'],
    exposedHeaders: ['sessionId'],
    secret: 'reply-analyzer',
    resave: false,
    saveUninitialized: false,
    cookie : {
        secure: true,
        sameSite: 'None'
      }
}));

//View related middleware
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1) GLOBAL MIDDLEWARES
//SET SECURITY HTTP HEADERS
// app.use(helmet({ contentSecurityPolicy: false }));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));


// DEVELOPMENT LOGGING
if(process.env.NODE_ENV==='development'){
//middleware//
//using third party middleware
app.use(morgan('Dev'));
}

const limiter=rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:'Too many requests'

});
//LIMIT REQUEST FROM SAME API
app.use('/api',limiter);

//Body Parser
app.use(express.json());
//cookieParser
app.use(cookieParser()); 
//url encoded
app.use(express.urlencoded({extended:true,limit:'10kb'}));

//data sanitization against data from NOSQL injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution

app.use(hpp({
    whitelist:[
        'duration',
        'ratingQuantity',
        'ratingsAverage',
       ' maxGroupsSize',
       'difficulty',
       'price'
    ]
})
);
app.use(compression());

// .listen creates a server which listens the requests of the client
// takes two arguments port and a call back function
//                        MDDLEWARES
//12.  and 13 Middleware
//creating our own middle ware
//the order of middleware is very important

//test middleware
app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    console.log(req.cookies);
    //next() is always complusary for middleware
    next();

});

//Routes


app.use('/',viewRouter);
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewsRouter);

app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:'fail',
    //     message:`Can't find ${req.originalUrl} on this server`

    // });
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404));

});
app.use(globalErrorHandler);

module.exports=app;

