const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");

const stream = require("stream");
const { google } = require("googleapis");
const { PDFDocument } = require("pdf-lib");
const drive = google.drive('v3');

const sendMailForMIAM2 = function ( mediatorData ,clientData, messageBodyinfo ) {

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
        to: mediatorData.email,
        subject: `MIAM 1 has been applied by ${clientData.fname} ${clientData.surName}`,
        html: `<body>
      <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
      <h1>Hello ${mediatorData.name} 's Teams  </h1>
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

        // await createMIAM1Upload(client1data , Reference);

        const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
     
        let mediatorData = {}, clientData = {}, messageBodyinfo = {};

        mediatorData.name =`${medData.connectionData.mediatorID.firstName} ${ medData.connectionData.mediatorID.lastName}`;

        // will replace this by medEmail
        const medEmail = medData.connectionData.mediatorID.email;
        mediatorData.email = "abdosamir023023@gmail.com"

        if (!currentCase.client1AddedData) {

            let updatedCase = await Case.findByIdAndUpdate(req.params.id, { client1data, Reference, client1AddedData: true })

            clientData.fname = updatedCase.client1data[0].personalInfo.firstName;
            clientData.surName = updatedCase.client1data[0].personalInfo.surName;

          
            messageBodyinfo.formUrl = `${config.baseUrl}/${config.MIAM_PART_2}/${updatedCase._id}`;
            
            console.log(updatedCase)
            sendMailForMIAM2(mediatorData,clientData,messageBodyinfo)
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
    page.drawText(`First name: ${client1data.personalInfo.firstName}`, { x: 50, y: 600 });
    page.drawText(`Sur name: ${client1data.personalInfo.surName}`, { x: 50, y: 650 });
    page.drawText(`Birthday: ${client1data.personalInfo.dateOfBirth}`, { x: 50, y: 700 });
    page.drawText(`Phone: ${client1data.personalInfo.phoneNumber}`, { x: 50, y: 750 });
    page.drawText(`email: ${client1data.personalInfo.email}`, { x: 50, y: 800 });

    // Save the PDF document to a buffer
    const pdfBytes = await pdfDoc.save();



    // Create a new Google Drive client
    const auth = new google.auth.GoogleAuth({
      // Add your Google Drive API credentials and scopes here
      keyFile: "../DMS-Backend/credentials.json", // Path to your JSON credentials file
      scopes: ["https://www.googleapis.com/auth/drive"], // Scopes required for accessing Google Drive
    });


    const drive = google.drive({ version: "v3", auth });

    // Create the folder in Google Drive
    const folderMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    };
    const folder = await drive.files.create({
      resource: folderMetadata,
      fields: "id",
    });
    const folderId = folder.data.id;

    console.log(folderId);

    // Create a readable stream from the PDF bytes
    const readableStream = new stream.Readable({
      read() {
        this.push(pdfBytes);
        this.push(null);
      },
    });

    // Upload the PDF to the created folder
    const fileMetadata = {
      name: `"MIAM-1'${Date.now()}'.pdf"`,
      parents: [folderId],
    };

    const media = {
      mimeType: "application/pdf",
      body: readableStream,
    };
    await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    // Call the function with the folder ID and personal account email
    shareWithPersonalAccount(folderId, 'mkabary8@gmail.com');

    console.log("PDF created and uploaded successfully");
  } catch (error) {
    console.error("Error creating PDF and uploading to Google Drive:", error);
  }
}




async function shareWithPersonalAccount(folderId, personalAccountEmail) {
  const authClient = await google.auth.getClient({
    keyFile: '../DMS-Backend/credentials.json', // Path to your service account key file
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  // Set the permissions for the folder or file
  const permission = {
    type: 'user',
    role: 'writer', // Adjust the role as needed
    emailAddress: personalAccountEmail,
  };

  // Share the folder or file with the personal account
  await drive.permissions.create({
    auth: authClient,
    fileId: folderId, // The ID of the folder or file to share
    requestBody: permission,
  });

  console.log('Folder or file shared successfully!');
}






module.exports = router;