const express = require('express');
const {
  signUp,
  signIn,

} = require('./userController');

const userRouter = express.Router();


userRouter.route('/sign-up').post(signUp);
userRouter.route('/sign-in').post(signIn);


module.exports = userRouter;
