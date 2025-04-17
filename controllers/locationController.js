const { Location } = require('../models');

/**
 * GET /api/locations
 * Fetch all non-deleted locations (for map or contact page).
 */
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/locations
 * Create a new location (branch, clinic, etc.).
 * Expects: name, address, phone, email, lat/lng, language
 */
const createLocation = async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      email,
      latitude,
      longitude,
      language = 'en'
    } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required.' });
    }

    const location = await Location.create({
      name,
      address,
      phone,
      email,
      latitude,
      longitude,
      language,
      created_by: req.user.id,
      updated_by: req.user.id
    });

    res.status(201).json(location);
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/locations/:id
 * Update a location entry.
 */
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      phone,
      email,
      latitude,
      longitude,
      language
    } = req.body;

    const location = await Location.findByPk(id);
    if (!location) return res.status(404).json({ message: 'Location not found' });

    await location.update({
      name,
      address,
      phone,
      email,
      latitude,
      longitude,
      language,
      updated_by: req.user.id
    });

    res.json(location);
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/locations/:id
 * Soft delete a location.
 */
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findByPk(id);
    if (!location) return res.status(404).json({ message: 'Location not found' });

    await location.update({ deleted_by: req.user.id });
    await location.destroy();

    res.json({ message: 'Location deleted successfully.' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation
};
