const Sequelize = require('sequelize');
require('dotenv').config();

const { PASSWORD, USER, DATABASE } = process.env;

const db = new Sequelize(DATABASE,USER,PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
logginf:false
});

// testing db connection
function dbConnectionTest() {
  db.authenticate().then(() => console.log('database connected...'));
}

module.exports = { db, dbConnectionTest };
