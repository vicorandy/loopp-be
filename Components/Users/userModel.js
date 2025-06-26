const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../../db/Sequelize');

require('dotenv');

const User = db.define(
  'users',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },

    firstName: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    lastName: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    userRole : {
      type: Sequelize.ENUM('project-owner','project-manager','project-engineer'),
      allowNull : false
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    yearsOfExperience: {
      type: Sequelize.DOUBLE,
      allowNull:true,
    },

    openToRemoteWork: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },

    phoneNumber: {
      type: Sequelize.STRING,
      allowNull:true,
    }

  },
  {
    timestamps: false,
  }
);

// Hook for hashing passwords
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
});

// Hook for comparing password
User.prototype.comparePassword = async (password, hash) => {
  const isCorrect = await bcrypt.compare(password, hash);
  return isCorrect;
};

// Creating json web token
User.prototype.createJWT = (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_lLIFETIME,
  });
  return token;
};

// verifying json web token
User.prototype.verifyJWT = (token) => {
  const payLoad = jwt.verify(token, process.env.JWT_SECRETE);
  return payLoad;
};

// Generating verification code
User.prototype.createVerificationCode = () => {
  const verificationCode =
    Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  return verificationCode;
};

// creating password hash
User.prototype.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

db.sync().then(()=>console.log('user table created'))

module.exports = User;
