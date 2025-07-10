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
  const baseName = path.parse(file.originalname).name;
  const outputDir = path.join('output');
  const thumbPattern = `${baseName}_thumb_%i.png`;
  const thumbPathPattern = path.join(outputDir, thumbPattern);


  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }


  ffmpeg(inputPath)
    .on('end', () => {

      const thumbs = [1, 2, 3].map(i => `${baseName}_thumb_${i}.png`);
      res.json({ thumbnails: thumbs });

      fs.unlinkSync(inputPath);
    })
    .on('error', (err) => {
      fs.unlinkSync(inputPath);
      res.status(500).json({ error: 'Failed to generate thumbnails', details: err.message });
    })
    .screenshots({
      count: 3,
      folder: outputDir,
      filename: thumbPattern,
      size: '320x?',
    });
});

module.exports = router; 