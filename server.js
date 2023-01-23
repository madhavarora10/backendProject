const mongoose=require('mongoose');

 //UNCAUGHT EXCEPTION SYNC

 process.on('uncaughtException',err=>{
    console.log(err.name,err.message);
    console.log('UNCAUGHT EXCEPTION');
        process.exit(1);
 }) ;

dotenv=require('dotenv');
const app= require('./app');

dotenv.config({path: './config.env'});

const DB= process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose
.connect(DB,{
})
.then(()=>console.log('Db connected'));

    
const port =process.env.PORT||3000;
// .listen creates a server which listens the requests of the client
// takes two arguments port and a call back function
const server=app.listen(port, ()=>{
    // now as our server is listening  we have to define routing 
    //  routing is how an server respond to client request of url or http request
    console.log('app running');
    });


    ///UNHANDLED PROMISE REJECTION LIKE NOT CONNECTING WITH DATABASE 
 process.on('unhandledRejection',err=>{
    console.log(err.name,err.message);
    console.log('UNHANDLED REJECTION');
    server.close(()=>{
        process.exit(1);

    });

 }) ;  


  