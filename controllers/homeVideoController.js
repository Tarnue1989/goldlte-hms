const { HomeVideo } = require('../models');

/**
 * GET /api/videos
 * Fetch all non-deleted videos ordered by featured flag and creation date.
 */
const getAllVideos = async (req, res) => {
  try {
    const videos = await HomeVideo.findAll({
      order: [['is_featured', 'DESC'], ['createdAt', 'DESC']]
    });
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/videos
 * Create a new homepage video entry with optional uploaded file or URL.
 */
const createVideo = async (req, res) => {
  try {
    const { title, video_url = '', language = 'en', is_featured = false } = req.body;
    const uploadedVideo = req.files?.video_file?.[0];
    const thumbnail = req.files?.video_thumb?.[0]?.path || null;

    if (!title?.trim() || (!uploadedVideo && !video_url.trim())) {
      return res.status(400).json({ message: 'Title and either video file or URL is required.' });
    }

    const finalUrl = uploadedVideo ? `/assets/videos/${uploadedVideo.filename}` : video_url.trim();

    const newVideo = await HomeVideo.create({
      title: title.trim(),
      video_url: finalUrl,
      thumbnail,
      language,
      is_featured: Boolean(is_featured),
      created_by: req.user.id,
      updated_by: req.user.id
    });

    res.status(201).json(newVideo);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/videos/:id
 * Update video details, including file or URL and optional thumbnail.
 */
const updateVideo = async (req, res) => {
  try {
    const { title, video_url = '', language, is_featured = false } = req.body;
    const video = await HomeVideo.findByPk(req.params.id);

    if (!video) return res.status(404).json({ message: 'Video not found' });

    const uploadedVideo = req.files?.video_file?.[0];
    const uploadedThumb = req.files?.video_thumb?.[0];

    const finalUrl = uploadedVideo
      ? `/assets/videos/${uploadedVideo.filename}`
      : video_url.trim() || video.video_url;

    await video.update({
      title: title?.trim() || video.title,
      video_url: finalUrl,
      language: language || video.language,
      is_featured: Boolean(is_featured),
      thumbnail: uploadedThumb?.path || video.thumbnail,
      updated_by: req.user.id
    });

    res.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/videos/:id
 * Soft delete a video (sets deleted_by and triggers Sequelize paranoid).
 */
const deleteVideo = async (req, res) => {
  try {
    const video = await HomeVideo.findByPk(req.params.id);

    if (!video) return res.status(404).json({ message: 'Video not found' });

    await video.update({ deleted_by: req.user.id });
    await video.destroy();

    res.json({ message: 'Video deleted successfully.' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo
};
