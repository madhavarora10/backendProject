
const express= require('express');
const tourController= require('./../Controllers/tourConrollers');
const authController=require('./../Controllers/authController');
const reviewController=require('./../Controllers/reviewController');
const reviewRouter=require('./../routes/reviewsRouter');

//param middlewre 18.
//router.param('id',tourController.checkId);

const Router=express.Router();

Router.use('/:tourId/reviews',reviewRouter);

Router
.route('/top-5-cheap')
.get(tourController.aliasTopTours,tourController.getallTours);

Router
.route('/monthly-plan/:year')
.get(tourController.getMonthlyPlan);

Router.route('/tour-stats')
.get(tourController.getTourStats);

///tours-within/:distance/center/:latlng/unit/:unit
///tours-within/:233/center/:-40,45/unit/:mi
Router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getTourWithin);

Router
.route('/')
.get(tourController.getallTours)
.post( authController.protect,
       authController.restrictTo('admin','lead-guide'),
       tourController.createtour
    );

Router
.route('/:id')
.get(tourController.getTour)
.patch(authController.protect,
       authController.restrictTo('admin','lead-guide'),
       tourController.updatetour
      )
.delete(
    authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.deleteTour);


//Post /tour/2345/reviews
//Get /tour/2343ds/reviews/986dd
// Router.route('/:tourId/reviews').post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
// )

module.exports = Router;