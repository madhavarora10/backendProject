const express=require('express');
const reviewController=require('./../Controllers/reviewController');
const authController=require('./../Controllers/authController');


const router= express.Router({mergeParams:true});

router.use(authController.protect);

router
.route('/')
.get(reviewController.getAllReviews)
.post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
    );

 router
 .route('/:id')
 .patch(authController.restrictTo('user','admin'),
  reviewController.updateReview
  )
 .delete(
    authController.restrictTo('user','admin'),
    reviewController.deleteReview);   

module.exports=router;    