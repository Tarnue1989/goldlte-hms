const { Announcement } = require('../models');

/**
 * GET /api/announcements
 * Fetch all non-deleted announcements (optionally filtered by language).
 */
const getAllAnnouncements = async (req, res) => {
  try {
    const language = req.query.lang || 'en';

    const announcements = await Announcement.findAll({
      where: { language },
      order: [['createdAt', 'DESC']]
    });

    res.json(announcements);
  } catch (error) {
    console.error('❌ Error fetching announcements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/announcements
 * Create a new announcement.
 */
const createAnnouncement = async (req, res) => {
  try {
    const { content, language = 'en' } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: 'Announcement content is required.' });
    }

    const announcement = await Announcement.create({
      content,
      language,
      created_by: req.user.id,
      updated_by: req.user.id
    });

    res.status(201).json({ message: 'Announcement created.', announcement });
  } catch (error) {
    console.error('❌ Error creating announcement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/announcements/:id
 * Update an announcement's content or language.
 */
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, language } = req.body;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.update({
      content,
      language,
      updated_by: req.user.id
    });

    res.json({ message: 'Announcement updated.', announcement });
  } catch (error) {
    console.error('❌ Error updating announcement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/announcements/:id
 * Soft delete the announcement (tracks deleted_by).
 */
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.update({ deleted_by: req.user.id });
    await announcement.destroy(); // Sequelize soft delete

    res.json({ message: 'Announcement deleted successfully.' });
  } catch (error) {
    console.error('❌ Error deleting announcement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
