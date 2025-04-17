const { Slide } = require('../models');

/**
 * GET /api/slides?lang=en
 * Fetch all non-deleted slides, optionally filtered by language.
 */
const getAllSlides = async (req, res) => {
  try {
    const { lang } = req.query;

    const slides = await Slide.findAll({
      where: lang ? { language: lang } : {},
      order: [['createdAt', 'DESC']]
    });

    res.json(slides);
  } catch (error) {
    console.error('❌ Error fetching slides:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/slides
 * Create a new slide with an image.
 * Expects image via multer (req.file.path) and optional language.
 */
const createSlide = async (req, res) => {
  try {
    const { language = 'en' } = req.body;
    const image_path = req.file?.path;

    if (!image_path) {
      return res.status(400).json({ message: 'Slide image is required.' });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Only image files are allowed.' });
    }

    const slide = await Slide.create({
      image_path,
      language,
      created_by: req.user.id,
      updated_by: req.user.id
    });

    res.status(201).json({ message: 'Slide created successfully.', slide });
  } catch (error) {
    console.error('❌ Error creating slide:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/slides/:id
 * Update slide language or replace image.
 */
const updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { language } = req.body;
    const image_path = req.file?.path;

    const slide = await Slide.findByPk(id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });

    if (req.file && !req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Only image files are allowed.' });
    }

    await slide.update({
      ...(language && { language }),
      ...(image_path && { image_path }),
      updated_by: req.user.id
    });

    res.json({ message: 'Slide updated successfully.', slide });
  } catch (error) {
    console.error('❌ Error updating slide:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/slides/:id
 * Soft delete a slide using Sequelize's paranoid mode.
 */
const deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const slide = await Slide.findByPk(id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });

    await slide.update({ deleted_by: req.user.id });
    await slide.destroy();

    res.json({ message: 'Slide deleted successfully.' });
  } catch (error) {
    console.error('❌ Error deleting slide:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide
};
