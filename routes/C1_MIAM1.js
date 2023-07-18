const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const GoogleFunctions = require("../global/GoogleAPIs");
const stream = require("stream");
const { google } = require("googleapis");
const { PDFDocument } = require("pdf-lib");
const { gmail } = require('googleapis/build/src/apis/gmail');
const crypto = require("crypto");
const drive = google.drive('v3');
const dateNow = require("../global/dateNow")
const sendMailForMIAM2 = function (mediatorData, clientData, messageBodyinfo) {

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
      <h3>MIAM 1 has been applied by C1 ${clientData.fname} ${clientData.surName} and that's your link to apply your MIAM 2 </h3>
      <a href='${messageBodyinfo.formUrl}' style="color:white; padding:5px; font-size: larger; font-weight: bolder;border:solid 5px">Click here </a>
      <h4> MIAM 1_C1 is attached as a pdf file </h4>

      <p> Best Regards </p>
      <p> DMS Team </p>
      
      </div>
      </body>`,

  });

}

router.patch("/addC1MIAM1/:id", async (req, res) => {

//currentCase.startDate
  try {

    let currentCase = await Case.findById(req.params.id);
   //  GoogleFunctions(currentCase._id, "mkabary8@gmail.com", "abdo.samir.7719@gmail.com" );

    let client1data = req.body
    let Reference = `${req.body.personalContactAndCaseInfo.surName}& ${req.body.otherParty.otherPartySurname}`;
    let MajorDataC1 = {
      fName: req.body.personalContactAndCaseInfo.firstName,
      sName: req.body.personalContactAndCaseInfo.surName,
      mail: req.body.personalContactAndCaseInfo.email,
      phoneNumber: req.body.personalContactAndCaseInfo.phoneNumber
    }

    let MajorDataC2 = {
      fName: req.body.otherParty.otherPartyFirstName,
      sName: req.body.otherParty.otherPartySurname,
      mail: req.body.otherParty.otherPartyEmail,
      phoneNumber: req.body.otherParty.otherPartyPhone,
    }

   let availableTimes_C1={
      whatDaysCanNotAttend:req.body.personalContactAndCaseInfo.whatDaysCanNotAttend,
      appointmentTime:req.body.personalContactAndCaseInfo.appointmentTime,
    }

    const StringfyData = JSON.stringify(client1data)


    const companyData = await Case.findById(currentCase._id).populate('connectionData.companyID');

    const companyEmail = companyData.connectionData.companyID.email;

    // await createMIAM1Upload(client1data , Reference ,companyEmail , req.params.id );

    

    const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
    let mediatorData = {}, clientData = {}, messageBodyinfo = {};
    mediatorData.name = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;

    // will replace this by medEmail
    const medEmail = medData.connectionData.mediatorID.email;
    mediatorData.email = medEmail


    // GoogleFunctions.createEvent(currentCase._id, currentCase.startDate, medEmail, MajorDataC1.mail, MajorDataC2.mail);
    
    //!currentCase.client1AddedData
    if (true) {


      let statusRemider = {
        reminderID: `${currentCase._id}-statusRemider`,
        reminderTitle: `${currentCase.Reference}-MIAM Part 1-C1`,
        startDate: dateNow()
      }
      // console.log(statusRemider)

 

      await Case.findByIdAndUpdate(req.params.id, {
        client1data: StringfyData, $set: {
          'Reminders.statusRemider': statusRemider
        }, Reference, client1AddedData: true, MajorDataC1, MajorDataC2,availableTimes_C1, status: "MIAM Part 1-C1"
      })
      const updatedCase = await Case.findById(req.params.id);

      const parsedClientData = JSON.parse(updatedCase.client1data)

      clientData.fname = parsedClientData.personalContactAndCaseInfo.firstName;
      clientData.surName = parsedClientData.personalContactAndCaseInfo.surName;
      messageBodyinfo.formUrl = `${config.baseUrlMIAM2}/${config.MIAM_PART_2}/${updatedCase._id}`;

      sendMailForMIAM2(mediatorData, clientData, messageBodyinfo)


      //console.log("client_data_fromDB", parsedClientData)
      res.status(200).json({ "message": "M1_C1 has been added" })

    }
    else {
      res.status(400).json({ "message": "this from has been applied before" })

    }
  } catch (err) {
    res.status(400).json(err.message)
  }


})


//this function create pdf and folder and then upload it to that google drive folder 
async function createMIAM1Upload(client1data, folderName , email , caseID) {
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
    page.drawText(`First name: ${client1data.personalContactAndCaseInfo.firstName}`, { x: 50, y: 600 });
    page.drawText(`Sur name: ${client1data.personalContactAndCaseInfo.surName}`, { x: 50, y: 650 });
    page.drawText(`Birthday: ${client1data.personalContactAndCaseInfo.dateOfBirth}`, { x: 50, y: 700 });
    page.drawText(`Phone: ${client1data.personalContactAndCaseInfo.phoneNumber}`, { x: 50, y: 750 });
    page.drawText(`email: ${client1data.personalContactAndCaseInfo.email}`, { x: 50, y: 800 });

    // Save the PDF document to a buffer
    const pdfBytes = await pdfDoc.save();

    const companyData = await Case.findById(caseID).populate('connectionData.companyID');
 
    const companyServiceAccount = companyData.connectionData.companyID.serviceAccount;
    const companyServiceAccountKey = companyData.connectionData.companyID.serviceAccountKey;
    

  
    const plain = Buffer.from(companyServiceAccountKey, 'base64').toString('utf8') 
    


    const plainParsed = JSON.parse(plain);
    const privatekey1 = plainParsed.private_key;

  

    const auth = await google.auth.getClient({
      credentials: {
        client_email: companyServiceAccount ,
        private_key: privatekey1,
      },
      scopes: ['https://www.googleapis.com/auth/drive'], // Scopes required for accessing Google Drive
    });


    const drive = google.drive({ version: "v3", auth });

    // Get the folder ID using the reference object (folder name)
    const response = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
    });


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

    //put the FolderID into the database
    await Case.findByIdAndUpdate(caseID, { folderID: folderId });


    // Call the function with the folder ID and personal account email
    shareWithPersonalAccount(folderId, email , companyServiceAccount , privatekey1 );//the gmail sharing account that belong to the company 

    console.log("PDF created and uploaded successfully");
  } catch (error) {
    console.error("Error creating PDF and uploading to Google Drive:", error);
  }
}




async function shareWithPersonalAccount(folderId, personalAccountEmail , Semail , Skey ) {

  const authClient = await google.auth.getClient({
    credentials: {
      client_email: Semail ,
      private_key: Skey,
    },
    scopes: ['https://www.googleapis.com/auth/drive'], // Scopes required for accessing Google Drive
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

  console.log('Folder shared successfully!');
}
 

module.exports = router;
