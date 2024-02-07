const express = require('express');
const multer = require('multer');
const fs = require('fs');
const AdmZip = require('adm-zip');
const path = require('path');
const serveIndex = require('serve-index');

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

// Serve the 'uploads' directory with directory listings
app.use('/uploads', express.static(path.join(__dirname, 'uploads')), serveIndex(path.join(__dirname, 'uploads'), { 'icons': true }));

// Serve the HTML form for file upload
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for handling file upload
app.post('/upload', upload.single('file'), (req, res, next) => {

    console.log('Received file upload request:', req.file.originalname);

    const uploadFolderPath = path.join(__dirname, 'uploads');
    const zipFilePath = path.join(uploadFolderPath, req.file.filename);

    console.log('Unpacking zip:', zipFilePath);
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(uploadFolderPath, /*overwrite*/ true);

    // Remove the uploaded zip file after extraction
    fs.unlink(zipFilePath, (err) => {
	if (err) {
	    console.error('Error deleting zip file:', err);
	} else {
	    console.log('Deleted zip file:', zipFilePath);
	}
    });

    // Read data.json and send it as response
    const jsonDataPath = path.join(uploadFolderPath, 'data.json');
    fs.readFile(jsonDataPath, 'utf8', (err, data) => {
	if (err) {
	    console.error('Error reading data.json:', err);
	    res.status(500).send('Error reading data.json');
	} else {
	    console.log('Read data.json:', jsonDataPath);
	    const jsonData = JSON.parse(data);
	    res.json(jsonData);
	}
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
