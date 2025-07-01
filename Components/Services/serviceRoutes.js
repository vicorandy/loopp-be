const express = require('express')
const upload  = require('../../MiddelWare/upload')
const {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    searchService
  } = require('./serviceController')
  const authorization = require('../../MiddelWare/auth')


const serviceRouter = express.Router()
serviceRouter.route('/add-service').post(upload.single('file'),authorization,createService)
serviceRouter.route('/edit-service/:id').post(upload.single('file'),authorization,updateService)
serviceRouter.route('/search-service').get(searchService)
serviceRouter.route('/delete-service/:id').delete(authorization,deleteService)
serviceRouter.route('/get-services').get(getAllServices)



module.exports = serviceRouter




