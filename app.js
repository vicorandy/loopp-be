require('express-async-errors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const express = require('express');
const cors = require('cors')
const usersRouter = require('./Components/Users/userRoutes');
const serviceRouter = require('./Components/Services/serviceRoutes')
const projectsRouter = require('./Components/Projects/projectsRoutes')
const notFoundError = require('./MiddelWare/notFound');

// const { USERS_URI } = process.env;

const app = express();


//cors set up
app.use(cors({
    origin: '*', // Replace with your frontend domain in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies or HTTP auth
  }));

// request body paser
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({ extended: true,limit:"10nb" }));

// swagger documentation
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/services',serviceRouter);
app.use('/api/v1/projects',projectsRouter)
app.use(notFoundError);

module.exports = app;
