const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { verifyToken } = require('../middleware/auth.middleware');

// @route   POST /api/upload
// @desc    Upload media files
// @access  Private
router.post('/', verifyToken, upload.array('media', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No files uploaded'
      });
    }

    // Generate URLs for uploaded files
    const uploadedFiles = req.files.map(file => ({
      id: file.filename.split('.')[0], // Use filename without extension as ID
      type: file.mimetype.startsWith('video/') ? 'video' : 'image',
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.status(200).json({
      status: 'success',
      message: 'Files uploaded successfully',
      data: { files: uploadedFiles }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error uploading files',
      error: error.message
    });
  }
});

// @route   DELETE /api/upload/:filename
// @desc    Delete a media file
// @access  Private
router.delete('/:filename', verifyToken, (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../uploads', req.params.filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({
      status: 'success',
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting file',
      error: error.message
    });
  }
});

module.exports = router;
