const fs= require('fs');
const mongoose=require('mongoose');
const dotenv=require('dotenv');

// const Tour = require("../../models/tourModel");
const review = require("../../models/ReviewModel");
const user = require("../../models/userModel");

dotenv.config({path: './config.env'});

const DB= process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose
.connect(DB,{  
})
.then(()=>console.log('Db connected'));


//reading data
// const tours= JSON.parse(fs.readFileSync(`${__dirname}/simple-tours.json`, 'utf-8'));
const users= JSON.parse(fs.readFileSync(`${__dirname}/user.json`, 'utf-8'));
const reviews= JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));


// importing data
const importData= async()=>{

    try{
        // await Tour.create(tours)
        await user.create(users,{validateBeforeSave:false});
        await review.create(reviews);
        console.log('data logged');

    } catch(err){
        console.log(err);

    }
    process.exit();
};
const deleteData= async()=>{

    try{
        // await Tour.deleteMany();
        await user.deleteMany();
        await review.deleteMany();
        console.log('data deleted');

    } catch(err){
        console.log(err);

    }
    process.exit();
};

if(process.argv[2]==='--import'){
    importData();
}
if(process.argv[2]==='--delete'){
    deleteData();
}


console.log(process.argv);