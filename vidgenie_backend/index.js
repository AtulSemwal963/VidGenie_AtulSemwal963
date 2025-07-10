const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
const conversionRoutes = require('./routes/conversion');
app.use('/api/convert', conversionRoutes);

const metadataRoutes = require('./routes/metadata');
app.use('/api/metadata', metadataRoutes);

const thumbnailRoutes = require('./routes/thumbnail');
app.use('/api/thumbnail', thumbnailRoutes);

app.use('/output', express.static(path.join(__dirname, 'output')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
