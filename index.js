const express = require('express');
const multer = require('multer');
const fs = require('fs');
const unzipper = require('unzipper');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up multer storage to save uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
	cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
	cb(null, file.originalname);
    }
});

// Initialize multer instance with configured options
const upload = multer({
    storage: storage
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML form for file upload
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res, next) => {
    console.log('File uploaded successfully');
  
    // Extract the uploaded zip file
    const zipFilePath = path.join(__dirname, 'uploads', req.file.filename);
    const extractPath = path.join(__dirname, 'uploads', 'extracted');
  
    console.log('Extracting zip file...');
    fs.createReadStream(zipFilePath)
	.pipe(unzipper.Extract({ path: extractPath }))
	.on('error', (err) => {
	    console.error('Error extracting zip file:', err);
	    return next(err);
	})
	.on('finish', () => {
	    console.log('Zip file extracted successfully');
      
	    // Read and parse the data.json file
	    console.log('Reading data.json file...');
	    const jsonData = require(path.join(extractPath, 'data.json'));
      
	    // Serve the JSON data and images
	    res.json(jsonData);
      
	    // Clean up extracted files
	    console.log('Cleaning up extracted files...');
	    fs.unlink(zipFilePath, () => {});
	    fs.rmdir(extractPath, { recursive: true }, () => {});
	});
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).send('Error occurred: ' + err.message);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
