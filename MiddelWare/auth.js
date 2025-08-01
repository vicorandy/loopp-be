const jwt = require('jsonwebtoken');

// AUTHORIZING USERS
async function authorization(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      res.status(401);
      res.json({ message: 'invalid user token' });
      throw new Error('invalid user id');
    }
    const token = authHeader.split(' ')[1];
    //  verifying user token
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    const { userid, userName ,userRole,userEmail } = payLoad;
    const user = { userid, userName ,userRole,userEmail };

    // creating user object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401);
      res.json({ message: 'invalid user token' });
    } else {
      res.status(500);
      res.json({ message: 'Something went wrong' });
    }
  }
}

module.exports = authorization;
