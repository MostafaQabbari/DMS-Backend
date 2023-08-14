const express = require('express');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const config = require("../config/config");
const Case = require('../models/case');
const router = express.Router();
const { google } = require("googleapis");




// Set up the storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for uploads (you can customize this)
    cb(null, './uploads/pdfs');
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
    keyFile: config.credentialFile1, // Replace with the path to your service account key file
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
    const caseData = await Case.findById(caseID);
    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const folderId = caseData.folderID;

    // Get the Google Drive API client
    const drive = await getDriveApiClient();

    // Upload each file to the case folder on Google Drive
    for (const file of files) {
      const fileMetadata = {
        name: file.originalname,
        parents: [folderId],
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
      fs.unlinkSync(file.path);
    }

    const companyData = await Case.findById(caseID).populate('connectionData.companyID');
    const sharingGmail = companyData.connectionData.companyID.sharingGmail;

   await shareWithPersonalAccount(folderId, sharingGmail || "mkabary8@gmail.com" );


    res.json({ message: "Files uploaded successfully " });
  } catch (error) {
    console.error('Error uploading files:', error.message);
    res.status(500).json({ message: 'Failed to upload files' });
  }
});



// Define a route to handle the form submission
async function shareWithPersonalAccount(folderId, personalAccountEmail) {
  try {
    const authClient = await google.auth.getClient({
      keyFile: config.credentialFile1,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth: authClient });

    const permission = {
      type: 'user',
      role: 'writer',
      emailAddress: personalAccountEmail,
    };

    await drive.permissions.create({
      fileId: folderId,
      requestBody: permission,
    });

    console.log('Folder shared successfully!');
  } catch (error) {
    console.error('Error sharing folder:', error.message);
  }
}

// router.post('/submit-form', async (req, res) => {
//   try {
//     // Retrieve form data from the request body
//     const { name, email, message } = req.body;

//     // Create a new PDF document
//     const pdfDoc = await PDFDocument.create();

//     // Add a new page to the document
//     const page = pdfDoc.addPage();

//     // Set the font and font size
//     const font = await pdfDoc.embedFont('Helvetica');
//     page.setFont(font);
//     page.setFontSize(12);

//     // Write the form data to the PDF page
//     page.drawText(`Name: ${name}`, { x: 50, y: 700 });
//     page.drawText(`Email: ${email}`, { x: 50, y: 650 });
//     page.drawText(`Message: ${message}`, { x: 50, y: 600 });

//     // Save the PDF to a file
//     const pdfBytes = await pdfDoc.save();

//     // Generate a unique filename for the PDF
//     const fileName = `${Date.now()}.pdf`;

//     // Define the file path to save the PDF
//     const filePath = path.join(__dirname, '../uploads/pdfs', fileName);

//     // Save the PDF file to a specified location
//     fs.writeFileSync(filePath, pdfBytes);

//     // // Save the file path and other metadata to MongoDB
//     // await saveToMongoDB(filePath, name, email, message);

//     // Send a response with the file download link
//     res.status(200).json({ downloadLink: `/download/${fileName}` });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Define a route to handle the file download
// router.get('/download/:fileName', (req, res) => {
//   try {
    
//     // Retrieve the filename from the URL parameter
//     const fileName = req.params.fileName;

//     // Define the file path
//     const filePath = path.join(__dirname, '../uploads/pdfs', fileName);

//     // Send the file as a response
//     res.sendFile(filePath);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



// async function shareWithPersonalAccount(folderId, personalAccountEmail  ) {

//   const authClient = await google.auth.getClient({
//     keyFile: config.credentialFile1,
//     scopes: ['https://www.googleapis.com/auth/drive'], // Scopes required for accessing Google Drive
//   });

//   // const auth = await getDriveApiClient();
//   const drive = await getDriveApiClient();
//   // Set the permissions for the folder or file
//   const permission = {
//     type: 'user',
//     role: 'writer', // Adjust the role as needed
//     emailAddress: personalAccountEmail,
//   };

//   // Share the folder or file with the personal account
//   await drive.permissions.create({
//     auth: authClient,
//     fileId: folderId, // The ID of the folder or file to share
//     requestBody: permission,
//   });

//   console.log('Folder shared successfully!');
// }


module.exports = router;