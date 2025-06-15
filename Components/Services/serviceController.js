// controllers/serviceController.js
const Service = require('./serviceModel')  // adjust path as needed
const cloudinary = require('../../config/cloudinary');

// CREATE
async function createService(req, res) {
  try {
    const { name, category, description, verified = false, pro = false } = req.body;
    
    // Validate required fields
    if (!name || !category || !description) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, category, and description are required' 
      });
    }
    
    let imageUrl = null;
    console.log({ name, category, description, verified });
    
    // If there's an image file, upload to Cloudinary
    if (req.file) {
      try {
        const uploadPromise = new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { 
              folder: 'services',
              resource_type: 'auto', // Automatically detect file type
              transformation: [
                { width: 800, height: 600, crop: 'limit' }, // Optimize image size
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
     
        const uploadResult = await uploadPromise;
        imageUrl = uploadResult.secure_url;
        
      } catch (uploadError) {
        return res.status(500).json({ 
          message: 'Error uploading image to Cloudinary',
          error: uploadError.message 
        });
      }
    }
    
    // Create service in database
    const service = await Service.create({
      name,
      category,
      description,
      image: imageUrl,
      verified,
      pro,
    });
    
    return res.status(201).json({ 
      message: 'Service created successfully',
      service
    });
    
  } catch (err) {
    console.error('Service creation error:', err);
    
    // Handle different types of errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: err.errors 
      });
    }
    
    if (err.code === 11000) { // MongoDB duplicate key error
      return res.status(409).json({ 
        message: 'Service with this name already exists' 
      });
    }
    
    return res.status(500).json({ 
      message: 'Internal server error while creating service' 
    });
  }
}

// GET ALL SERVICES
async function getAllServices(req, res) {
  try {
    const services = await Service.findAll();
    res.json({ message:'Services fetched successfully',services });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching services' });
  }
}

// READ ONE
async function getServiceById(req, res) {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching service' });
  }
}

// UPDATE
async function updateService(req, res) {
  try {
    const { id } = req.params;
    const { name, category, description, verified, pro } = req.body;
    const service = await Service.findByPk(id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    // If new image uploaded, replace on Cloudinary
    if (req.file) {
      // (optional) delete old image via cloudinary.uploader.destroy(service.public_id)
      const uploadResult = await cloudinary.uploader.upload_stream(
        { folder: 'services' },
        (error, result) => { if (error) throw error; return result; }
      ).end(req.file.buffer);
      service.image = uploadResult.secure_url;
    }

    service.name        = name        ?? service.name;
    service.category    = category    ?? service.category;
    service.description = description ?? service.description;
    service.verified    = verified    ?? service.verified;
    service.pro         = pro         ?? service.pro;

    await service.save();
    res.json({ message: 'Service updated', service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating service' });
  }
}

// DELETE
async function deleteService(req, res) {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    // (optional) delete image from Cloudinary by public_id
    await service.destroy();
    res.json({ message: 'Service deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting service' });
  }
}

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
