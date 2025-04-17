const fs = require('fs');
const path = require('path');
const { SystemSettings } = require('../models');

/**
 * GET /api/settings
 * Fetch the latest system settings (logo, footer, video, contact, etc.)
 */
const getSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne({
      order: [['createdAt', 'DESC']]
    });

    if (!settings) {
      return res.status(404).json({ message: 'System settings not found.' });
    }

    res.json(settings);
  } catch (error) {
    console.error('❌ Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/settings
 * Create or update branding and system-wide configuration
 */
const updateSettings = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      updated_by: req.user.id
    };

    if (payload.footer_text) payload.footer_text = payload.footer_text.trim();
    if (payload.contact_email) payload.contact_email = payload.contact_email.trim();
    if (payload.contact_phone) payload.contact_phone = payload.contact_phone.trim();
    if (payload.language) payload.language = payload.language.trim();

    let settings = await SystemSettings.findOne();

    if (!settings) {
      settings = await SystemSettings.create({
        ...payload,
        created_by: req.user.id
      });
      return res.status(201).json({ message: '✅ Settings created.', settings });
    }

    await settings.update(payload);
    res.json({ message: '✅ Settings updated.', settings });
  } catch (error) {
    console.error('❌ Error updating system settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/settings/logo
 * Upload logo and/or favicon (image validation included)
 */
const uploadLogoOrFavicon = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne();
    if (!settings) return res.status(404).json({ message: 'System settings not found.' });

    const updates = {};
    const files = req.files;

    if (files?.logo?.[0]) {
      const logo = files.logo[0];
      if (!logo.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Invalid logo file type.' });
      }
      updates.logo_path = logo.path;
    }

    if (files?.favicon?.[0]) {
      const favicon = files.favicon[0];
      if (!favicon.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Invalid favicon file type.' });
      }
      updates.favicon_path = favicon.path;
    }

    updates.updated_by = req.user.id;
    await settings.update(updates);

    res.status(200).json({
      message: '✅ Upload successful.',
      data: updates
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ message: 'Upload failed.', error });
  }
};

/**
 * DELETE /api/settings/logo
 * Delete logo image from disk and clear DB path
 */
const deleteLogo = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne();
    if (!settings || !settings.logo_path) {
      return res.status(404).json({ message: 'Logo not found.' });
    }

    const logoPath = settings.logo_path;
    if (fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }

    await settings.update({
      logo_path: null,
      updated_by: req.user.id
    });

    res.status(200).json({ message: '✅ Logo deleted successfully.' });
  } catch (error) {
    console.error('❌ Error deleting logo:', error);
    res.status(500).json({ message: 'Failed to delete logo.' });
  }
};

/**
 * DELETE /api/settings
 * Soft delete the settings record
 */
const deleteSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found.' });
    }

    await settings.update({ deleted_by: req.user.id });
    await settings.destroy();

    res.status(200).json({ message: '✅ Settings deleted.' });
  } catch (error) {
    console.error('❌ Failed to delete settings:', error);
    res.status(500).json({ message: 'Server error while deleting settings.' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  uploadLogoOrFavicon,
  deleteLogo,
  deleteSettings
};
