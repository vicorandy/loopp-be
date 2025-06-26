const express = require('express');
const authorization = require('../../MiddelWare/auth');
const {
  signUp,
  signIn,
  getUserInfo,
  getUsersByRole

} = require('./userController');

const userRouter = express.Router();


userRouter.route('/sign-up').post(signUp);
userRouter.route('/sign-in').post(signIn);
userRouter.route('/get-user-info').get(authorization,getUserInfo);
userRouter.route('/get-user-by-role/:userRole').get(authorization,getUsersByRole);


module.exports = userRouter;
