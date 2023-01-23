const express= require('express');
const userController= require('./../Controllers/userControllers');
const authController= require('./../Controllers/authController');


const Router=express.Router();
Router.post('/signup',authController.signup);
Router.post('/login',authController.login);
Router.get('/logout',authController.logout);


Router.post('/forgotPassword',authController.forgotPassword);
Router.patch('/resetPassword/:token',authController.resetPassword);


//protect middleware 
Router.use(authController.protect);

Router.patch(
    '/updateMyPassword',
    authController.updatePassword
);

Router.get('/me',
userController.getMe,
userController.getUser
);

Router.patch('/updateMe',
userController.uploadUserPhoto,
userController.updateMe);

Router.delete('/deleteMe',userController.deleteMe);


//REstrict to admin
Router.use(authController.restrictTo('admin'));

Router
.route('/')
.get(userController.getAllUsers);

Router
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);


module.exports=Router;


