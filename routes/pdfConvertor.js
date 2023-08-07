const express = require('express');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const config = require("../config/config");
const Case = require('../models/case');
const router = express.Router();




// Set up the storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for uploads (you can customize this)
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Create the multer middleware to handle file uploads
const upload = multer({ storage });

// Function to authenticate the service account and get the Drive API client
async function getDriveApiClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: '../credentials-folder/direct-mediation-services-web-f8ebfd3e36fc.json', // Replace with the path to your service account key file
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({
    version: 'v3',
    auth: await auth.getClient(),
  });

  return drive;
}

// Endpoint to handle file uploads
router.post('/uploadFiles/:caseID', upload.array('files', 10), async (req, res) => {
  try {
    const { caseID } = req.params;
    const files = req.files;

    // Get the Google Drive case folder ID from the database based on the caseID
    const caseFolderID = Case.findById(caseID).FolderID; // Replace with your code to get the folder ID from the database

    // Get the Google Drive API client
    const drive = await getDriveApiClient();

    // Upload each file to the case folder on Google Drive
    for (const file of files) {
      const fileMetadata = {
        name: file.originalname,
        parents: [caseFolderID],
      };

      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      };

      await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });

      // Delete the uploaded file from the server (optional)
      // fs.unlinkSync(file.path);
    }

    res.json({ message: 'Files uploaded successfully' });
  } catch (error) {
    console.error('Error uploading files:', error.message);
    res.status(500).json({ message: 'Failed to upload files' });
  }
});

// Define a route to handle the form submission
router.post('/submit-form', async (req, res) => {
  try {
    // Retrieve form data from the request body
    const { name, email, message } = req.body;

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a new page to the document
    const page = pdfDoc.addPage();

    // Set the font and font size
    const font = await pdfDoc.embedFont('Helvetica');
    page.setFont(font);
    page.setFontSize(12);

    // Write the form data to the PDF page
    page.drawText(`Name: ${name}`, { x: 50, y: 700 });
    page.drawText(`Email: ${email}`, { x: 50, y: 650 });
    page.drawText(`Message: ${message}`, { x: 50, y: 600 });

    // Save the PDF to a file
    const pdfBytes = await pdfDoc.save();

    // Generate a unique filename for the PDF
    const fileName = `${Date.now()}.pdf`;

    // Define the file path to save the PDF
    const filePath = path.join(__dirname, '../uploads/pdfs', fileName);

    // Save the PDF file to a specified location
    fs.writeFileSync(filePath, pdfBytes);

    // // Save the file path and other metadata to MongoDB
    // await saveToMongoDB(filePath, name, email, message);

    // Send a response with the file download link
    res.json({ downloadLink: `/download/${fileName}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define a route to handle the file download
router.get('/download/:fileName', (req, res) => {
  try {
    
    // Retrieve the filename from the URL parameter
    const fileName = req.params.fileName;

    // Define the file path
    const filePath = path.join(__dirname, '../uploads/pdfs', fileName);

    // Send the file as a response
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// // Function to save the PDF metadata to MongoDB
// async function saveToMongoDB(filePath, name, email, message) {
//   // Implement MongoDB saving logic here
// }


module.exports = router;