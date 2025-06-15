const express = require('express')
const upload  = require('../../MiddelWare/upload')
const {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
  } = require('./serviceController')


const serviceRouter = express.Router()
serviceRouter.route('/add-service').post(upload.single('file'),createService)
serviceRouter.route('/get-services').get(getAllServices)



module.exports = serviceRouter




