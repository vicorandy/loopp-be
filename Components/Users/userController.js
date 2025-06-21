require('dotenv').config();
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../../Utils/email');
const {
  passwordValidator,
  emailValidator,
} = require('../../Utils/stringValidator');
const User = require('./userModel');


// FOR CREATING A USER ACCOUNT

async function signUp(req, res) {
  try {
    const { firstName, lastName, email, password, userRole ,projectMangerSecret } = req.body;
    
  
    const isEmailCorrect = emailValidator(email);
    const isPasswordCorrect = passwordValidator(password);
    const allowedRoles = ['project-owner', 'project-manager', 'project-engineer'];


    // validating user password
    if (!isEmailCorrect) {
      res.status(400);
      res.json({
        message: 'the email you entered appers to be missing the @ symbol',
      });
      return;
    }

    // validating password
    if (!isPasswordCorrect) {
      res.status(400);
      res.json({
        message:
          'make sure your password has at least one upper-case, lowercase, symbol, number, and is has a minimun of 8 characters in length example (AAbb12#$)',
      });
      return;
    }

    if(!userRole){
      return res.status(400).json({message:'please select a user role'})
    }
     console.log(userRole,userRole.includes(allowedRoles),allowedRoles)
    if(!allowedRoles.includes(userRole)){
      return res.status(400).json({message:'please enter a valid user role'})
    }

    if(userRole === 'project-manager'){
      if(projectMangerSecret !== process.env.PROJECT_MANAGER_SECRET){
         return res.status(400).json({message:'Invalid request Please see the Admin'})
      }
    }

    // checking if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409);
      res.json({
        message:
          'This email address has already been registered to an account.',
      });
      return;
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      userRole
    });

    const token = user.createJWT({
      userid: user.id,
      username: user.firstName,
      useremail: user.email,
      userRole : user.userRole
    });

    // deleting hashed password
    delete user.dataValues.password;

    res.status(201);
    res.json({
      message: 'user account was created successfully',
      user,
      token,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409);
      res.json({
        message:
          'This email address has already been registered to an account.',
      });
    } else {
      console.error(error)
      res.status(500);
      res.json({ message: 'something went wrong' });
    }
  }
}


// FOR LOGGING INTO A USER ACCOUNT

async function signIn(req, res) {
  try {
    // checking if all credentials are provided
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      res.json({ message: 'please enter your email and password' });
      return;
    }

    // fetching user
    const user = await User.findOne({ where: { email } });

    // if the user does not exist
    if (!user) {
      res.status(404);
      res.json({ message: 'invalid email or password' });
      return;
    }

    // comfirming if the user password is correct
    const hash = user.password;
    const isCorrect = await user.comparePassword(password, hash);
    if (!isCorrect) {
      res.status(400);
      res.json({ message: 'invalid email or password' });
    }

    // creating jsonwebtoken
    const token = user.createJWT({
      userid: user.id,
      username: user.firstName,
      useremail: user.email,
    });

    // deleting hashed password
    delete user.dataValues.password;

    // sending final response to client
    res.status(200);
    res.json({ message: 'login was successful', user, token });
  } catch (error) {
    res.status(500);
    res.json({ message: 'Something went wrong' });
  }
}
// ////////////////////////////////////////////////////////////////////////////

// FOR RETRIEVING USE INFO
// ////////////////////////////////////////////////////////////////////////////



module.exports={
  signUp,
  signIn
}