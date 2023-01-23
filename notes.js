const { application } = require('express');
const express= require('express');
const { toUSVString } = require('util');


// express is a function upon which calling will add bunch of methods on app
const app= express();
//middleware//
//using third party middleware
app.use(morgan('Dev'));
app.use(express.json());
const port =3000;
// .listen creates a server which listens the requests of the client
// takes two arguments port and a call back function
app.listen(port, ()=>{
    // now as our server is listening  we have to define routing 
    //  routing is how an server respond to client request of url or http request
    });



//routing 
/*     app.get('/',(req, res)=>{
           res.status(200).send('heloo from server');
          //we can also send json
          res.json({message: 'heloo from jason'});
            });

        app.post('/',(req,res)=>{
         res.send('you can post this')
 
        });*/

        //6. GET REQUEST//
//its parsed outside sycly because it will be loaded only once when browser is loaded
const tours=JSON.parse(
 fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// here it will send parsed json when ever there is a request for this URL
 app.get('api/v1/tours',(req,res)=>{
    res.status(200).json({
        status:'status',
        results: toUSVString.length,
        //this is called envloping of data to send to the request it is stored inside the object
        data:{
            tours
            // here second tours refers to the parsed upar const wala jisme parsed simple.json hai tours
        }
    });
 });
        

    //7.POST REQUEST////
    app.post('/api/v1/tours',(req,res)=>{
        

        //creating a new id for newly created input
        const newID=tours[tours.length -1]+1;
        const newTour =Object.assign({id:newId},req.body);
         /// here adding new created input in our file based data
        tours.push(newTour);
        fs.writefile(
            //overwriting file
            '${__dirname}/dev/dev-data/data/tours-simple.json',
           
           // converting tours object into string
            JSON.stringify(tours),
            err=>{
                res.status(201).json({
                    status :'success',
                    data:{
                        tour: newTour
                    }
                });
            }
        );

    });




 



//////////////8.RESPONDING TO URL PARAMETERS//////////////
//id  is a variable
application.get('/api/v1/tours/:id',(req,res)=>{
    //param constains all the variables 
    //multiplied 1 to convert it in string
    const id =req.params.id *1;
    const tour=tours.find(el=>el.id===id)
    if(!tour){
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id'
        });
    }
    res.status(200).json({
        status:'sucess',
        data:{
            tour
        }
    });
});







/////9. Patch//

app.patch('/api/v1/tours/:id',(req,res)=>{
    if(!tour){
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id'
        });
    

}
res.status(200).json({
    status:'success',
    data:{
        tour:'updated'
    }
})
});


//10.delete////

//11.refactoring our route

const updatetour=(req,res)=>{
    if(!tour){
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id'
        });
    

}
res.status(200).json({
    status:'success',
    data:{
        tour:'updated'
    }
})
};



app.patch('/api/v1/tours/:id',updatetour);

//the below method is usefull as if we want to change version we will have to change in all the route
//another way of refactoring is below:

// this will let us chain all the route on this "a/api/v1/tours"
//whenever there this request for put then put will work 
//and if get then get will work
 app.route('a/api/v1/tours')
    .get(getallTours)
    .post(createTour) 

app.route('api/v1/tours/:id')
    .get(gettour)
    .patch(updatetour)   
    .delete(deleteTour)



//12.  and 13 Middleware
//creating our own middle ware
//the order of middleware is very important
app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    //next() is always complusary for middleware
    next();

});

//14.using 3rd party middleware
//line 10
//15.implimenting the users routes

app.route('/api/v1/users')
   .get(getallUsers//this is a function//
       )
   .post(createuser);
  
app .route('/api/v1/1User')
    .get(getUser)
    .patch(updateuser)
    .delete(deleteuser);   


//16.Creating and mounting multiple Routers  



const tourRouter=express.Router();
const userRouter=express.Router();

tourRouter
.route('/')
.get(getallTours)
.post(createTour);

tourRouter
.route('/:id')
.get(getTours)
.patch(updateTour)
.delete(deleteTour);


userRouter
.route('/')
.get(getallUsers)
.post(createUsers);

userRouter
.route('/:id')
.get(getUser)
.patch(updateuser)
.delete(deleteuser);


app.use('api/v1/tours',tourRouter);
app.use('api/v1/users',userRouter);