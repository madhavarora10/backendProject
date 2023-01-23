const fs= require('fs');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const app= require('../../app');
const Tour = require("../../models/tourModel");

dotenv.config({path: './config.env'});

const DB= process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
    );

mongoose
.connect(DB,{  
})
.then(()=>console.log('Db connected'));


//reading data
const tours= JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));


// importing data
const importData= async()=>{

    try{
        await Tour.create(tours)
        console.log('data logged');

    } catch(err){
        console.log(err);

    }
    process.exit();
};
const deleteData= async()=>{

    try{
        await Tour.deleteMany();
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