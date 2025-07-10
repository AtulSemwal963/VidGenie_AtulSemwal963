const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024 },
});


router.post('/', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const inputPath = file.path;
  ffmpeg.ffprobe(inputPath, (err, metadata) => {

    fs.unlinkSync(inputPath);
    if (err) {
      return res.status(500).json({ error: 'Failed to extract metadata', details: err.message });
    }

    const format = metadata.format || {};
    const streams = metadata.streams || [];
    const videoStream = streams.find(s => s.codec_type === 'video');
    res.json({
      duration: format.duration,
      size: format.size,
      bit_rate: format.bit_rate,
      width: videoStream ? videoStream.width : null,
      height: videoStream ? videoStream.height : null,
      codec: videoStream ? videoStream.codec_name : null,
      format_name: format.format_name,
    });
  });
});

module.exports = router; 