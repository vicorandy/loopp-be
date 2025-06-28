const Sequelize = require('sequelize');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;
const { PASSWORD, USER, DATABASE } = process.env;

const db = DATABASE_URL
  ? new Sequelize(DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // for some managed DBs like Render
        },
      },
    })
  : new Sequelize(DATABASE, USER, PASSWORD, {
      host: 'localhost',
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

// testing db connection
function dbConnectionTest() {
  db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.error('Database connection error:', err));
}

module.exports = { db, dbConnectionTest };
