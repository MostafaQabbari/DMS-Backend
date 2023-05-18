const express = require('express');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const router = express.Router();

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

    // Save the file path and other metadata to MongoDB
    await saveToMongoDB(filePath, name, email, message);

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
    const filePath = path.join(__dirname, 'pdfs', fileName);

    // Send the file as a response
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to save the PDF metadata to MongoDB
async function saveToMongoDB(filePath, name, email, message) {
  // Implement MongoDB saving logic here
}


module.exports = router;