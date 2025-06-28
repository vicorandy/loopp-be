const express = require('express')
const {createProject} =require('./projectsController')
const authorization = require('../../MiddelWare/auth')

const projectsRouter = express.Router()

projectsRouter.route('/create-projects').post(authorization,createProject)

module.exports = projectsRouter