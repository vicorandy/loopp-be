const express = require('express');
const {
  signUp,
  signIn,

} = require('./userController');

const userRouter = express.Router();


userRouter.route('/signup').post(signUp);
userRouter.route('/signin').post(signIn);


module.exports = userRouter;
