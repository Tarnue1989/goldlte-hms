const { HomeAbout } = require('../models');

/**
 * GET /api/about
 * Fetch the most recent non-deleted About content (supports language filtering).
 */
const getAboutContent = async (req, res) => {
  try {
    const language = req.query.lang || 'en';

    const about = await HomeAbout.findOne({
      where: { language },
      order: [['createdAt', 'DESC']]
    });

    if (!about) {
      return res.status(404).json({ message: 'About section not found.' });
    }

    res.json(about);
  } catch (error) {
    console.error('❌ Error fetching about content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/about
 * Create new About content. One per language is allowed.
 */
const createAboutContent = async (req, res) => {
  try {
    const { content, language = 'en' } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const existing = await HomeAbout.findOne({
      where: { language }
    });

    if (existing) {
      return res.status(400).json({
        message: `About content already exists for language: ${language}. Please update instead.`
      });
    }

    const about = await HomeAbout.create({
      content,
      language,
      created_by: req.user.id,
      updated_by: req.user.id
    });

    res.status(201).json({ message: 'About content created.', about });
  } catch (error) {
    console.error('❌ Error creating about content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/about/:id
 * Update About content.
 */
const updateAboutContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, language } = req.body;

    const about = await HomeAbout.findByPk(id);
    if (!about) {
      return res.status(404).json({ message: 'About content not found.' });
    }

    await about.update({
      content,
      language,
      updated_by: req.user.id
    });

    res.json({ message: 'About content updated.', about });
  } catch (error) {
    console.error('❌ Error updating about content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/about/:id
 * Soft delete About content.
 */
const deleteAboutContent = async (req, res) => {
  try {
    const { id } = req.params;

    const about = await HomeAbout.findByPk(id);
    if (!about) {
      return res.status(404).json({ message: 'About content not found.' });
    }

    await about.update({ deleted_by: req.user.id });
    await about.destroy(); // Sequelize soft delete

    res.json({ message: 'About content deleted successfully.' });
  } catch (error) {
    console.error('❌ Error deleting about content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAboutContent,
  createAboutContent,
  updateAboutContent,
  deleteAboutContent
};
