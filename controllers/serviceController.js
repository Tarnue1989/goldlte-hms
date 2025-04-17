const { Service } = require('../models');

/**
 * GET /api/services?lang=en
 * Fetch all services, optionally filtered by language.
 */
const getAllServices = async (req, res) => {
  try {
    const { lang } = req.query;

    const services = await Service.findAll({
      where: lang ? { language: lang } : {},
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json(services);
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/services
 * Create a new service entry.
 * Requires: title
 * Optional: description, order, image_path (via multer), language
 */
const createService = async (req, res) => {
  try {
    const { title, description, order = 0, language = 'en' } = req.body;
    const image_path = req.file?.path || null;

    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    if (req.file && !req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Only image files are allowed.' });
    }

    const service = await Service.create({
      title,
      description,
      image_path,
      order,
      language,
      created_by: req.user.id,
      updated_by: req.user.id
    });

    res.status(201).json({ message: 'Service created successfully.', service });
  } catch (error) {
    console.error('❌ Error creating service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/services/:id
 * Update an existing service entry.
 */
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order, language } = req.body;
    const image_path = req.file?.path;

    const service = await Service.findByPk(id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    if (req.file && !req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Only image files are allowed.' });
    }

    await service.update({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(order !== undefined && { order }),
      ...(language !== undefined && { language }),
      ...(image_path && { image_path }),
      updated_by: req.user.id
    });

    res.json({ message: 'Service updated successfully.', service });
  } catch (error) {
    console.error('❌ Error updating service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/services/:id
 * Soft delete a service and record deleted_by.
 */
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    await service.update({ deleted_by: req.user.id });
    await service.destroy();

    res.json({ message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('❌ Error deleting service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllServices,
  createService,
  updateService,
  deleteService
};
