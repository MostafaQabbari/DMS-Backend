const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");

const fs = require("fs");
const { google } = require("googleapis");
const { PDFDocument } = require("pdf-lib");
const path = require('path');

const sendMailForMIAM2 = function (compData, clientData, messageBodyinfo) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        starttls: {
            enable: true
        },
        starttls: {
          enable: true
      },
    
        secureConnection: false,
    
        auth: {
          user: config.companyEmail,
          pass: config.appPassWord,
        },
     
      }) 
    


    let info = transporter.sendMail({
        from: config.companyEmail,
        to: compData.email,
        subject: `MIAM 1 has been applied by ${clientData.fname} ${clientData.surName}`,
        html: `<body>
      <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
      <h1>Hello ${compData.companyName} 's Teams  </h1>
      <h3>MIAM 1 has been applied by ${clientData.fname} ${clientData.surName} and that's your link to apply your MIAM 2 </h3>
      <a href='${messageBodyinfo.formUrl}' style="color:white; padding:5px; font-size: larger; font-weight: bolder;border:solid 5px">Click here </a>
      <h4> MIAM 1 is attached as a pdf file </h4>

      <p> Best Regards </p>
      <p> DMS Team </p>
      
      </div>
      </body>`,

    });

}

router.patch("/addClient1/:id", async (req, res) => {


    try {
        let currentCase = await Case.findById(req.params.id);
        let client1data = req.body
        let Reference = `${req.body.personalInfo.surName}& ${req.body.Client2Details.SurName}`;

        await createMIAM1Upload(client1data , Reference);

        const CompanyData = await Case.findById(req.params.id).populate('connectionData.companyID');
        const companyEmail = CompanyData.connectionData.companyID.email;
        let compData = {}, clientData = {}, messageBodyinfo = {};
        compData.companyName = CompanyData.connectionData.companyID.companyName;
        // will replace this by companyEmail
        compData.email = "abdo.samir.7719@gmail.com"

        if (currentCase.client1AddedData) {

            let updatedCase = await Case.findByIdAndUpdate(req.params.id, { client1data, Reference, client1AddedData: true })

            clientData.fname = updatedCase.client1data[0].personalInfo.firstName;
            clientData.surName = updatedCase.client1data[0].personalInfo.surName;

            console.log(updatedCase)
            messageBodyinfo.formUrl = `${config.baseUrl}/MIAM2/${updatedCase._id}`;

            sendMailForMIAM2(compData,clientData,messageBodyinfo)
            res.json(updatedCase)

        }
        else {
            res.json({ "message": "this from has been applied before" })

        }
    } catch (err) {
        res.json(err.message)
    }


})



async function createMIAM1Upload(client1data, folderName) {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a new page to the document
    const page = pdfDoc.addPage();

    // Set the font and font size
    const font = await pdfDoc.embedFont('Helvetica');
    page.setFont(font);
    page.setFontSize(12);

    // Add client data to the PDF document
    page.drawText(`First name: ${client1data.personalInfo.firstName}`, { x: 50, y: 1000 });
    page.drawText(`Sur name: ${client1data.personalInfo.surName}`, { x: 50, y: 950 });
    page.drawText(`Birthday: ${client1data.personalInfo.dateOfBirth}`, { x: 50, y: 900 });
    page.drawText(`Phone: ${client1data.personalInfo.phoneNumber}`, { x: 50, y: 850 });
    page.drawText(`email: ${client1data.personalInfo.email}`, { x: 50, y: 800 });
   
   
    // Save the PDF document to a buffer
    const pdfBytes = await pdfDoc.save();

    // Create a new Google Drive client
    const auth = new google.auth.GoogleAuth({
      // Add your Google Drive API credentials and scopes here
      keyFile: "../DMS-Backend/config/client_secret_719235602447-85v86uo3esfvgvfi80039284r68mi720.apps.googleusercontent.com.json", // Path to your JSON credentials file
      scopes: ["https://www.googleapis.com/auth/drive"], // Scopes required for accessing Google Drive
    });


    const drive = google.drive({ version: "v3", auth });
console.log(drive)
    // Get the folder ID using the reference object (folder name)
    const response = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
    });
    const folderId = response.data.files[0].id;

    // Upload the PDF to Google Drive folder
    const fileMetadata = {
      name: `"MIAM-1'${Date.now()}'.pdf"`,
      parents: [folderId],
    };
    const media = {
      mimeType: "application/pdf",
      body: fs.createReadStream(pdfBytes),
    };
    await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    console.log("PDF created and uploaded successfully");
  } catch (error) {
    console.error("Error creating PDF and uploading to Google Drive:", error);
  }
}





module.exports = router;