const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// In-memory progress store
const conversionProgress = {};

// Set up multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

// SSE endpoint for conversion progress
router.get('/progress/:id', (req, res) => {
  const id = req.params.id;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendProgress = () => {
    const progress = conversionProgress[id] || 0;
    res.write(`data: ${progress}\n\n`);
    if (progress >= 100) {
      clearInterval(interval);
      res.end();
      delete conversionProgress[id];
    }
  };

  const interval = setInterval(sendProgress, 500);
  req.on('close', () => {
    clearInterval(interval);
  });
});

// POST /api/convert
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { outputFormat } = req.body;
    const file = req.file;
    if (!file) {
      console.log('[ERROR] No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    if (!outputFormat) {
      console.log('[ERROR] No output format specified');
      return res.status(400).json({ error: 'No output format specified' });
    }

    const inputPath = file.path;
    const outputFilename = `${path.parse(file.originalname).name}_converted.${outputFormat}`;
    const outputPathUploads = path.join('uploads', outputFilename);
    const outputPathOutput = path.join('output', outputFilename);

    // Generate a unique conversion ID
    const conversionId = uuidv4();
    conversionProgress[conversionId] = 0;

    console.log(`[INFO] File upload received: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);
    console.log(`[INFO] Starting conversion: ${inputPath} -> ${outputPathUploads} as ${outputFormat}`);

    ffmpeg(inputPath)
      .toFormat(outputFormat)
      .on('start', () => {
        // Set initial progress to 1% so frontend can show indeterminate bar
        conversionProgress[conversionId] = 1;
      })
      .on('progress', (progress) => {
        // progress.percent is a float (0-100)
        if (progress.percent) {
          conversionProgress[conversionId] = Math.round(progress.percent);
        }
      })
      .on('end', () => {
        conversionProgress[conversionId] = 100;
        console.log(`[INFO] Conversion finished: ${outputPathUploads}`);
        // Copy the converted file to the output folder
        fs.copyFileSync(outputPathUploads, outputPathOutput);
        console.log(`[INFO] File copied to output folder: ${outputPathOutput}`);
        // Send the converted file for download (do not delete after sending)
        res.setHeader('X-Conversion-Id', conversionId);
        res.download(outputPathUploads, outputFilename, (err) => {
          if (err) {
            console.log(`[ERROR] Error sending file to user: ${err.message}`);
          } else {
            console.log(`[INFO] File sent to user: ${outputFilename}`);
          }
        });
      })
      .on('error', (err) => {
        conversionProgress[conversionId] = -1;
        console.log(`[ERROR] Conversion failed: ${err.message}`);
        res.status(500).json({ error: 'Conversion failed', details: err.message });
      })
      .save(outputPathUploads);
  } catch (err) {
    console.log(`[ERROR] Server error: ${err.message}`);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router; 