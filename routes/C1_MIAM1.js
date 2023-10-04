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
const dateNow = require("../global/dateNow");
const fs = require('fs');
const path = require('path');

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



   transporter.sendMail({
    from: config.companyEmail,
    to: mediatorData.email,
    subject: `MIAM 1 has been applied by ${clientData.fname} ${clientData.surName}`,
    html: `<body>
      <div style=" text-align: left;">
      <h1>Hello ${mediatorData.name} 's Teams  </h1>
      <h3>MIAM 1 has been applied by C1 ${clientData.fname} ${clientData.surName} and that's your link to apply your MIAM 2 </h3>
      <a href='${messageBodyinfo.formUrl}' style="  padding:5px; font-size: larger; font-weight: bolder;border:solid 5px">Click here </a>
      <h4> MIAM 1_C1 is attached as a pdf file </h4>

      <p> Best Regards </p>
      <p> DMS Team </p>
      
      </div>
      </body>`,

  });

}
const sendReplyMailToClient = function (companyData, clientData) {

  /*

   companyData ={companyName  , phoneNumber}
   clientData = {clientName ,email}
  */

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


   transporter.sendMail({
      from: config.companyEmail,
      to: clientData.email,
      subject: " MIAM I Applied Successfully",
      html: ` <div style=" text-align: left; ">
     <h1>Dear ${clientData.clientName}  </h1>
     <p>Thank you for filling out your MIAM part 1. </p>
   <p> This email is to confirm we have received your submission.</p>
   <p> This form will be very useful to the mediator when you have your MIAM meeting.</p>
   <p> If you have not been booked for an appointment yet, a member of the staff will get in touch shortly to book you in.</p>
    <p>If you have any questions in the meantime, feel free to call us on ${companyData.phoneNumber}</p>
    <p> Regards </p>
    <p>${companyData.companyName}</p>

     </div>`,


  })


  // transporter.sendMail(info, (error, info) => {
  //     if (error) {
  //         console.log('Error occurred while sending email:', error.message);

  //     } else {
  //         console.log('Email sent successfully:', info.messageId);
  //     }
  // });

}

router.patch("/addC1MIAM1/:id", async (req, res) => {

//currentCase.startDate
  try {

    let currentCase = await Case.findById(req.params.id);
    let majorDataC2FromM1 = req.body.otherParty ;
  //  ! GoogleFunctions.createEvent(currentCase.id, "mkabary8@gmail.com", "abdo.samir.7719@gmail.com" );

    let client1data = req.body
    let Reference = `${req.body.personalContactAndCaseInfo.surName} & ${req.body.otherParty.otherPartySurname}`;
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

     const sharingGmail = companyData.connectionData.companyID.sharingGmail;
     

    await createMIAM1Upload(client1data , Reference , sharingGmail ,req.params.id );




    

    const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
    let mediatorData = {}, clientData = {}, messageBodyinfo = {};
    mediatorData.name = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;
  //  mediatorData.name="xxx"
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

 

      const updatedCaseDetails= await Case.findByIdAndUpdate(req.params.id, {
        client1data: StringfyData, $set: {
          'Reminders.statusRemider': statusRemider
        }, Reference, client1AddedData: true, MajorDataC1, MajorDataC2,availableTimes_C1, status: "MIAM Part 1-C1" ,majorDataC2FromM1
      })
      //console.log("📢📢",updatedCaseDetails.majorDataC2FromM1)
      const updatedCase = await Case.findById(req.params.id);

      const parsedClientData = JSON.parse(updatedCase.client1data)

      clientData.fname = parsedClientData.personalContactAndCaseInfo.firstName;
      clientData.surName = parsedClientData.personalContactAndCaseInfo.surName;
      messageBodyinfo.formUrl = `${config.baseUrlMIAM2}/${config.MIAM_PART_2}/C1/${updatedCase._id}`;
      let companyDataObj={}
      const getCompData = await Case.findById(currentCase._id).populate('connectionData.companyID');
      companyDataObj.companyName = getCompData.connectionData.companyID.companyName;
      companyDataObj.phoneNumber = getCompData.connectionData.companyID.phoneNumberTwillio;
      clientData.clientName = `${parsedClientData.personalContactAndCaseInfo.firstName} ${parsedClientData.personalContactAndCaseInfo.surName}`;
      clientData.email = parsedClientData.personalContactAndCaseInfo.email;
    
      
      sendReplyMailToClient (companyDataObj, clientData)
      sendMailForMIAM2(mediatorData, clientData, messageBodyinfo);
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
async function createMIAM1Upload(client1data, folderName , sharingGmail , caseID) {
  try {

    const filePath = path.join(__dirname, '../uploads/pdfs/MIAM-1-temp.pdf');
    const pdfTemplateBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

    const pages = pdfDoc.getPages();
    const Page1 = pages[0];
    const Page2 = pages[1];
    const Page3 = pages[2];
    const Page4 = pages[3];
    const Page5 = pages[4];
    const Page6 = pages[5];
    const Page7 = pages[6];

    const font = await pdfDoc.embedFont('Helvetica');
    Page1.setFont(font);
    Page1.setFontSize(12);
    Page2.setFont(font);
    Page2.setFontSize(12);
    Page3.setFont(font);
    Page3.setFontSize(12);
    Page4.setFont(font);
    Page4.setFontSize(12);
    Page5.setFont(font);
    Page5.setFontSize(12);
    Page6.setFont(font);
    Page6.setFontSize(12);
    Page7.setFont(font);
    Page7.setFontSize(12);

    const personalContactAndCaseInfo = client1data.personalContactAndCaseInfo;
    const otherParty = client1data.otherParty;
    const children= client1data.children;
    const previousRelationshipDetails = client1data.previousRelationshipDetails;
    const courtProceedings = client1data.courtProceedings;
    const yourSolicitorOrMcKenzieFriend = client1data.yourSolicitorOrMcKenzieFriend;

    // Rest of your code to draw text on pages...
   // // Add client1 data to the PDF document"first page" 
   Page1.drawText("Yes" , { x: 350, y: 545 });//default is yes
   Page1.drawText(personalContactAndCaseInfo.firstName, { x: 350, y: 515 });
   Page1.drawText(personalContactAndCaseInfo.surName, { x: 350, y: 485 });
   Page1.drawText(personalContactAndCaseInfo.dateOfBirth, { x: 350, y: 455 });
   Page1.drawText(personalContactAndCaseInfo.phoneNumber , { x: 350, y: 425 });
   Page1.drawText(personalContactAndCaseInfo.email , { x: 350, y: 395 });
   Page1.drawText(
     `${personalContactAndCaseInfo.street}, ${personalContactAndCaseInfo.city}, ${personalContactAndCaseInfo.country}, ${personalContactAndCaseInfo.postCode}`,
     { x: 350, y: 365 }
   );//loctaion is address or not 
   Page1.drawText(personalContactAndCaseInfo.doesOtherPartyKnow, { x: 350, y: 335 });
   Page1.drawText(personalContactAndCaseInfo.makeDetailsConfidential, { x: 350, y: 275 });
   Page1.drawText(personalContactAndCaseInfo.isClientVulnerable, { x: 350, y: 215 });
   // Page1.drawText(personalContactAndCaseInfo.disabilityRegistered, { x: 350, y: 185 });
   Page1.drawText(personalContactAndCaseInfo.gender, { x: 350, y: 155 });
   Page1.drawText(personalContactAndCaseInfo.isWillingToTryMediation, { x: 350, y: 125 });
   

   //the second page 
   Page2.drawText(personalContactAndCaseInfo.areChangesToServicesRequired , { x: 350, y: 725 });
   Page2.drawText(personalContactAndCaseInfo.changesRequired ||"" , { x: 350, y: 685 });
   Page2.drawText(personalContactAndCaseInfo.willSupporterAttendMediation, { x: 350, y: 635 });
   Page2.drawText(personalContactAndCaseInfo.supporterNameAndRelation || "", { x: 350, y: 575 });
   Page2.drawText(personalContactAndCaseInfo.ethnicOrigin, { x: 350, y: 505 });
   Page2.drawText(personalContactAndCaseInfo.hasBritishPassport , { x: 350, y: 445 });
   Page2.drawText(personalContactAndCaseInfo.immigrationStatus || "" , { x: 350, y: 380 });
  //  Page2.drawText(personalContactAndCaseInfo., { x: 350, y: 305 });//leave it empty in the form
   Page2.drawText(personalContactAndCaseInfo.howClientFoundDMS, { x: 350, y: 265});
   Page2.drawText(personalContactAndCaseInfo.facedIssue, { x: 350, y: 215 });
   Page2.drawText(personalContactAndCaseInfo.isThereDaysCanNotAttend, { x: 350, y: 185 });
   Page2.drawText(personalContactAndCaseInfo.whatDaysCanNotAttend || "", { x: 350, y: 125 });



  //the third page 
  Page3.drawText(personalContactAndCaseInfo.appointmentTime , { x: 350, y: 735 });
  Page3.drawText(personalContactAndCaseInfo.otherParty , { x: 350, y: 675 });
  Page3.drawText(otherParty.otherPartyFirstName, { x: 350, y: 625 });
  Page3.drawText(otherParty.otherPartySurname, { x: 350, y: 585 });
  Page3.drawText(otherParty.otherPartyDateOfBirth, { x: 350, y: 535 });
  Page3.drawText(otherParty.otherPartyEmail, { x: 350, y: 505 });
  Page3.drawText(otherParty.otherPartyPhone , { x: 350, y: 475 });
  Page3.drawText(otherParty.otherPartyAddressKnown, { x: 350, y: 445 });//do you know the other party's adderss not found in the clinet1data
  if (otherParty || otherParty.otherPartyStreet || otherParty.otherPartyCity ||
    otherParty.otherPartyCountry || otherParty.otherPartyPostalCode) {
  Page3.drawText(
    `${otherParty.otherPartyStreet}, ${otherParty.otherPartyCity}, ${otherParty.otherPartyCountry}, ${otherParty.otherPartyPostalCode}`,
    { x: 350, y: 415 }
  );
}
  Page3.drawText(previousRelationshipDetails.separationDate, { x: 350, y: 385});
  Page3.drawText(previousRelationshipDetails.relationshipPeriod, { x: 350, y: 345 });
  Page3.drawText(previousRelationshipDetails.isMarried, { x: 350, y: 290 });
  Page3.drawText(previousRelationshipDetails.marriageDate || "", { x: 350, y: 225 });

  Page3.drawText(children[0]["Child One"].firstChildFirstName || "" , { x: 350, y: 175});
  Page3.drawText(children[0]["Child One"].firstChildSurName || "", { x: 350, y: 145 });
  Page3.drawText(children[0]["Child One"].firstChildGender || "" , { x: 350, y: 115 });
  Page3.drawText(children[0]["Child One"].firstChildLivingWith || "", { x: 350, y: 85 });
  

    //the forth page 
    Page4.drawText(children[0]["Child One"].firstChildDateOfBirth , { x: 350, y: 745 });
    Page4.drawText(children[0]["Child One"].isfirstChildHaveSpecialNeeds ||"" , { x: 350, y: 705 });
    Page4.drawText(children[0]["Child One"].firstChildResponsibility || "", { x: 350, y: 640 });
    Page4.drawText(children[0]["Child One"].secondChildCheck || "", { x: 350, y: 585 });
    Page4.drawText(children[1]["Child Two"].secondChildFirstName || "", { x: 350, y: 535 });
    Page4.drawText(children[1]["Child Two"].secondChildSurName || "" , { x: 350, y: 505 });
    Page4.drawText(children[1]["Child Two"].secondChildGender || "" , { x: 350, y: 475 });
    Page4.drawText(children[1]["Child Two"].secondChildLivingWith || "", { x: 350, y: 445 });
    Page4.drawText(children[1]["Child Two"].secondChildDateOfBirth || "", { x: 350, y: 415});
    Page4.drawText(children[1]["Child Two"].issecondChildHaveSpecialNeeds || "", { x: 350, y: 365 });
    Page4.drawText(children[1]["Child Two"].secondChildResponsibility || "", { x: 350, y: 315 });
    Page4.drawText(children[1]["Child Two"].thirdChildCheck || "", { x: 350, y: 250 });
    Page4.drawText(children[2]["Child Three"].thirdChildFirstName || "" , { x: 350, y: 205});
    Page4.drawText(children[2]["Child Three"].thirdChildSurName || "", { x: 350, y: 175 });
    Page4.drawText(children[2]["Child Three"].thirdChildGender || "" , { x: 350, y: 145 });
    Page4.drawText(children[2]["Child Three"].thirdChildLivingWith || "", { x: 350, y: 115 });
    Page4.drawText(children[2]["Child Three"].thirdChildDateOfBirth || "" , { x: 350, y: 85 });
   
    //the fifth page 
    Page5.drawText(children[2]["Child Three"].isthirdChildHaveSpecialNeeds || "" , { x: 350, y: 730 });
    Page5.drawText(children[2]["Child Three"].thirdChildResponsibility ||"" , { x: 350, y: 660 });
    Page5.drawText(children[2]["Child Three"].fourthChildCheck || "", { x: 350, y: 625 });
    Page5.drawText(children[3]["Child Four"].fourthChildFirstName || "", { x: 350, y: 565 });
    Page5.drawText(children[3]["Child Four"].fourthChildSurName || "", { x: 350, y: 535 });
    Page5.drawText(children[3]["Child Four"].fourthChildGender || "" , { x: 350, y: 505 });
    Page5.drawText(children[3]["Child Four"].fourthChildLivingWith || "" , { x: 350, y: 475 });
    Page5.drawText(children[3]["Child Four"].fourthChildDateOfBirth || "", { x: 350, y: 445 });
    Page5.drawText(children[3]["Child Four"].isfourthChildHaveSpecialNeeds || "", { x: 350, y: 400});
    Page5.drawText(children[3]["Child Four"].fourthChildResponsibility || "", { x: 350, y: 335 });
    Page5.drawText(children[3]["Child Four"].fifthChildCheck || "", { x: 350, y: 285 });
    Page5.drawText(children[4]["Child Five"].fifthChildFirstName || "", { x: 350, y: 235 });
    Page5.drawText(children[4]["Child Five"].fifthChildSurName || "" , { x: 350, y: 205});
    Page5.drawText(children[4]["Child Five"].fifthChildGender|| "", { x: 350, y: 175 });
    Page5.drawText(children[4]["Child Five"].fifthChildLivingWith || "" , { x: 350, y: 145 });
    Page5.drawText(children[4]["Child Five"].fifthChildDateOfBirth  || "", { x: 350, y: 115 });
    
    //the sixth page 
    Page6.drawText(children[4]["Child Five"].isfifthChildHaveSpecialNeeds || "" , { x: 350, y: 730 });
    Page6.drawText(children[4]["Child Five"].fifthChildResponsibility ||"" , { x: 350, y: 660 });
    Page6.drawText(children[4]["Child Five"].sixthChildCheck || "", { x: 350, y: 625 });
    Page6.drawText(children[5]["Child Six"].sixthChildFirstName || "", { x: 350, y: 565 });
    Page6.drawText(children[5]["Child Six"].sixthChildSurName || "", { x: 350, y: 535 });
    Page6.drawText(children[5]["Child Six"].sixthChildGender || "" , { x: 350, y: 505 });
    Page6.drawText(children[5]["Child Six"].sixthChildLivingWith || "" , { x: 350, y: 475 });
    Page6.drawText(children[5]["Child Six"].sixthChildDateOfBirth || "", { x: 350, y: 445 });
    Page6.drawText(children[5]["Child Six"].issixthChildHaveSpecialNeeds || "", { x: 350, y: 400});
    Page6.drawText(children[5]["Child Six"].sixthChildResponsibility || "", { x: 350, y: 335 });
    Page6.drawText(courtProceedings.isFacingLegalProceedings || "", { x: 350, y: 285 });
    Page6.drawText(courtProceedings.legalProceedingsInfo || "", { x: 350, y: 235 });
    Page6.drawText(courtProceedings.courtApplicationKnown || "" , { x: 350, y: 205});
    Page6.drawText(courtProceedings.courtApplicationInfo|| "", { x: 350, y: 175 });


    //the seventh page 
    Page7.drawText(courtProceedings.maritalStatus || "" , { x: 350, y: 750 });
    Page7.drawText(yourSolicitorOrMcKenzieFriend.solicitorCheck ||"" , { x: 350, y: 720 });
    Page7.drawText(yourSolicitorOrMcKenzieFriend.consultationRegardingLegalSupport || "", { x: 350, y: 670 });
    // Page7.drawText( || "", { x: 350, y: 565 });
    Page7.drawText(yourSolicitorOrMcKenzieFriend.solicitorLawFirmName || "", { x: 350, y: 535 });
    Page7.drawText(yourSolicitorOrMcKenzieFriend.solicitorTelephone || "" , { x: 350, y: 505 });
    Page7.drawText(yourSolicitorOrMcKenzieFriend.solicitorEmail || "" , { x: 350, y: 475 });
    Page7.drawText(yourSolicitorOrMcKenzieFriend.sendMediationCertificateToSolicitor || "", { x: 350, y: 445 });
    Page7.drawText("Yes" || "", { x: 350, y: 355});
    Page7.drawText("Yes" || "", { x: 350, y: 300 });
  

    

   
   


    // Save the PDF document to a buffer
    const pdfBytes = await pdfDoc.save();

    // const companyData = await Case.findById(caseID).populate('connectionData.companyID');


    // //getting the service account from the email
    // const companyServiceAccount = companyData.connectionData.companyID.serviceAccount;
    // const companyServiceAccountKey = companyData.connectionData.companyID.serviceAccountKey;
    

  
    // const plain = Buffer.from(companyServiceAccountKey, 'base64').toString('utf8') 
    


    // const plainParsed = JSON.parse(plain);
    // const privatekey1 = plainParsed.private_key;

    const auth = await google.auth.getClient({
      
      keyFile: config.credentialFile1,

      scopes: ['https://www.googleapis.com/auth/drive'], // Scopes required for accessing Google Drive
    });

  

    const drive = google.drive({ version: "v3", auth });


    // const drive = await getDriveApiClient();

    // // Get the folder ID using the reference object (folder name)
    // const response = await drive.files.list({
    //   q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
    // });


    // // Create the folder in Google Drive
    // const folderMetadata = {
    //   name: folderName,
    //   mimeType: "application/vnd.google-apps.folder",
    // };
    // const folder = await drive.files.create({
    //   resource: folderMetadata,
    //   fields: "id",
    // });
    // const folderId = folder.data.id;

    const currentCase = await Case.findById(caseID);

    const folderId = currentCase.folderID;


    // Usage
    updateFolderName(folderId, folderName);


    // Create a readable stream from the PDF bytes
    const readableStream = new stream.Readable({
      read() {
        this.push(pdfBytes);
        this.push(null);
      },
    });

    // Upload the PDF to the created folder
    const fileMetadata = {
      name: `"MIAM-1.pdf"`,
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
    // console.log(folderId);
    // console.log(sharingGmail);
    // //put the FolderID into the database
    // await Case.findByIdAndUpdate(caseID, { folderID: folderId });


    // Call the function with the folder ID and personal account email
    shareWithPersonalAccount(folderId, sharingGmail);//the gmail sharing account that belong to the company
    //sharingGmail || "mkabary8@gmail.com" || "hassantarekha@gmail.com"
    console.log("PDF created and uploaded successfully");
  } catch (error) {
    console.error("Error creating PDF and uploading to Google Drive:", error);
  }
}




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



async function updateFolderName(folderId, newFolderName) {
 
  const auth = await google.auth.getClient({
    keyFile: config.credentialFile1,
    scopes: ['https://www.googleapis.com/auth/drive'],
  }); // Authenticate with your service account

  const drive = google.drive({ version: 'v3', auth });

  try {
    const updatedFolderMetadata = await drive.files.update({
      fileId: folderId,
      resource: {
        name: newFolderName,
      },
    });

    console.log(`Folder name updated to: ${updatedFolderMetadata.data.name}`);
  } catch (error) {
    console.error(`Error updating folder name: ${error.message}`);
  }
}



    // generateAndSavePDF(client1data)
    // .then(message => console.log(message))
    // .catch(error => console.error('Error:', error));
 

// const generateAndSavePDF = async (client1data) => {
//   try {
//     const filePath = path.join(__dirname, '../uploads/pdfs/MIAM-1-temp.pdf');
//     const pdfTemplateBytes = fs.readFileSync(filePath);
//     const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

//     const pages = pdfDoc.getPages();
//     const Page1 = pages[0];
//     const Page2 = pages[1];
//     const Page3 = pages[2];
//     const Page4 = pages[3];
//     const Page5 = pages[4];
//     const Page6 = pages[5];
//     const Page7 = pages[6];

//     const font = await pdfDoc.embedFont('Helvetica');
//     Page1.setFont(font);
//     Page1.setFontSize(12);
//     Page2.setFont(font);
//     Page2.setFontSize(12);
//     Page3.setFont(font);
//     Page3.setFontSize(12);
//     Page4.setFont(font);
//     Page4.setFontSize(12);
//     Page5.setFont(font);
//     Page5.setFontSize(12);
//     Page6.setFont(font);
//     Page6.setFontSize(12);
//     Page7.setFont(font);
//     Page7.setFontSize(12);

//     const personalContactAndCaseInfo = client1data.personalContactAndCaseInfo;
//     const otherParty = client1data.otherParty;
//     const children= client1data.children;
//     const previousRelationshipDetails = client1data.previousRelationshipDetails;
//     const courtProceedings = client1data.courtProceedings;
//     const yourSolicitorOrMcKenzieFriend = client1data.yourSolicitorOrMcKenzieFriend;

//     // Rest of your code to draw text on pages...
//    // // Add client1 data to the PDF document"first page" 
//    Page1.drawText("Yes" , { x: 350, y: 545 });//default is yes
//    Page1.drawText(personalContactAndCaseInfo.firstName, { x: 350, y: 515 });
//    Page1.drawText(personalContactAndCaseInfo.surName, { x: 350, y: 485 });
//    Page1.drawText(personalContactAndCaseInfo.dateOfBirth, { x: 350, y: 455 });
//    Page1.drawText(personalContactAndCaseInfo.phoneNumber , { x: 350, y: 425 });
//    Page1.drawText(personalContactAndCaseInfo.email , { x: 350, y: 395 });
//    Page1.drawText(
//      `${personalContactAndCaseInfo.street}, ${personalContactAndCaseInfo.city}, ${personalContactAndCaseInfo.country}, ${personalContactAndCaseInfo.postCode}`,
//      { x: 350, y: 365 }
//    );//loctaion is address or not 
//    Page1.drawText(personalContactAndCaseInfo.doesOtherPartyKnow, { x: 350, y: 335 });
//    Page1.drawText(personalContactAndCaseInfo.makeDetailsConfidential, { x: 350, y: 275 });
//    Page1.drawText(personalContactAndCaseInfo.isClientVulnerable, { x: 350, y: 215 });
//    // Page1.drawText(personalContactAndCaseInfo.disabilityRegistered, { x: 350, y: 185 });
//    Page1.drawText(personalContactAndCaseInfo.gender, { x: 350, y: 155 });
//    Page1.drawText(personalContactAndCaseInfo.isWillingToTryMediation, { x: 350, y: 125 });
   

//    //the second page 
//    Page2.drawText(personalContactAndCaseInfo.areChangesToServicesRequired , { x: 350, y: 725 });
//    Page2.drawText(personalContactAndCaseInfo.changesRequired ||"" , { x: 350, y: 685 });
//    Page2.drawText(personalContactAndCaseInfo.willSupporterAttendMediation, { x: 350, y: 635 });
//    Page2.drawText(personalContactAndCaseInfo.supporterNameAndRelation || "", { x: 350, y: 575 });
//    Page2.drawText(personalContactAndCaseInfo.ethnicOrigin, { x: 350, y: 505 });
//    Page2.drawText(personalContactAndCaseInfo.hasBritishPassport , { x: 350, y: 445 });
//    Page2.drawText(personalContactAndCaseInfo.immigrationStatus || "" , { x: 350, y: 380 });
//   //  Page2.drawText(personalContactAndCaseInfo., { x: 350, y: 305 });//leave it empty in the form
//    Page2.drawText(personalContactAndCaseInfo.howClientFoundDMS, { x: 350, y: 265});
//    Page2.drawText(personalContactAndCaseInfo.facedIssue, { x: 350, y: 215 });
//    Page2.drawText(personalContactAndCaseInfo.isThereDaysCanNotAttend, { x: 350, y: 185 });
//    Page2.drawText(personalContactAndCaseInfo.whatDaysCanNotAttend || "", { x: 350, y: 125 });



//   //the third page 
//   Page3.drawText(personalContactAndCaseInfo.appointmentTime , { x: 350, y: 735 });
//   Page3.drawText(personalContactAndCaseInfo.otherParty , { x: 350, y: 675 });
//   Page3.drawText(otherParty.otherPartyFirstName, { x: 350, y: 625 });
//   Page3.drawText(otherParty.otherPartySurname, { x: 350, y: 585 });
//   Page3.drawText(otherParty.otherPartyDateOfBirth, { x: 350, y: 535 });
//   Page3.drawText(otherParty.otherPartyEmail, { x: 350, y: 505 });
//   Page3.drawText(otherParty.otherPartyPhone , { x: 350, y: 475 });
//   Page3.drawText(otherParty.otherPartyAddressKnown, { x: 350, y: 445 });//do you know the other party's adderss not found in the clinet1data
//   if (otherParty || otherParty.otherPartyStreet || otherParty.otherPartyCity ||
//     otherParty.otherPartyCountry || otherParty.otherPartyPostalCode) {
//   Page3.drawText(
//     `${otherParty.otherPartyStreet}, ${otherParty.otherPartyCity}, ${otherParty.otherPartyCountry}, ${otherParty.otherPartyPostalCode}`,
//     { x: 350, y: 415 }
//   );
// }
//   Page3.drawText(previousRelationshipDetails.separationDate, { x: 350, y: 385});
//   Page3.drawText(previousRelationshipDetails.relationshipPeriod, { x: 350, y: 345 });
//   Page3.drawText(previousRelationshipDetails.isMarried, { x: 350, y: 290 });
//   Page3.drawText(previousRelationshipDetails.marriageDate || "", { x: 350, y: 225 });

//   Page3.drawText(children[0]["Child One"].firstChildFirstName || "" , { x: 350, y: 175});
//   Page3.drawText(children[0]["Child One"].firstChildSurName || "", { x: 350, y: 145 });
//   Page3.drawText(children[0]["Child One"].firstChildGender || "" , { x: 350, y: 115 });
//   Page3.drawText(children[0]["Child One"].firstChildLivingWith || "", { x: 350, y: 85 });
  

//     //the forth page 
//     Page4.drawText(children[0]["Child One"].firstChildDateOfBirth , { x: 350, y: 745 });
//     Page4.drawText(children[0]["Child One"].isfirstChildHaveSpecialNeeds ||"" , { x: 350, y: 705 });
//     Page4.drawText(children[0]["Child One"].firstChildResponsibility || "", { x: 350, y: 640 });
//     Page4.drawText(children[0]["Child One"].secondChildCheck || "", { x: 350, y: 585 });
//     Page4.drawText(children[1]["Child Two"].secondChildFirstName || "", { x: 350, y: 535 });
//     Page4.drawText(children[1]["Child Two"].secondChildSurName || "" , { x: 350, y: 505 });
//     Page4.drawText(children[1]["Child Two"].secondChildGender || "" , { x: 350, y: 475 });
//     Page4.drawText(children[1]["Child Two"].secondChildLivingWith || "", { x: 350, y: 445 });
//     Page4.drawText(children[1]["Child Two"].secondChildDateOfBirth || "", { x: 350, y: 415});
//     Page4.drawText(children[1]["Child Two"].issecondChildHaveSpecialNeeds || "", { x: 350, y: 365 });
//     Page4.drawText(children[1]["Child Two"].secondChildResponsibility || "", { x: 350, y: 315 });
//     Page4.drawText(children[1]["Child Two"].thirdChildCheck || "", { x: 350, y: 250 });
//     Page4.drawText(children[2]["Child Three"].thirdChildFirstName || "" , { x: 350, y: 205});
//     Page4.drawText(children[2]["Child Three"].thirdChildSurName || "", { x: 350, y: 175 });
//     Page4.drawText(children[2]["Child Three"].thirdChildGender || "" , { x: 350, y: 145 });
//     Page4.drawText(children[2]["Child Three"].thirdChildLivingWith || "", { x: 350, y: 115 });
//     Page4.drawText(children[2]["Child Three"].thirdChildDateOfBirth || "" , { x: 350, y: 85 });
   
//     //the fifth page 
//     Page5.drawText(children[2]["Child Three"].isthirdChildHaveSpecialNeeds || "" , { x: 350, y: 730 });
//     Page5.drawText(children[2]["Child Three"].thirdChildResponsibility ||"" , { x: 350, y: 660 });
//     Page5.drawText(children[2]["Child Three"].fourthChildCheck || "", { x: 350, y: 625 });
//     Page5.drawText(children[3]["Child Four"].fourthChildFirstName || "", { x: 350, y: 565 });
//     Page5.drawText(children[3]["Child Four"].fourthChildSurName || "", { x: 350, y: 535 });
//     Page5.drawText(children[3]["Child Four"].fourthChildGender || "" , { x: 350, y: 505 });
//     Page5.drawText(children[3]["Child Four"].fourthChildLivingWith || "" , { x: 350, y: 475 });
//     Page5.drawText(children[3]["Child Four"].fourthChildDateOfBirth || "", { x: 350, y: 445 });
//     Page5.drawText(children[3]["Child Four"].isfourthChildHaveSpecialNeeds || "", { x: 350, y: 400});
//     Page5.drawText(children[3]["Child Four"].fourthChildResponsibility || "", { x: 350, y: 335 });
//     Page5.drawText(children[3]["Child Four"].fifthChildCheck || "", { x: 350, y: 285 });
//     Page5.drawText(children[4]["Child Five"].fifthChildFirstName || "", { x: 350, y: 235 });
//     Page5.drawText(children[4]["Child Five"].fifthChildSurName || "" , { x: 350, y: 205});
//     Page5.drawText(children[4]["Child Five"].fifthChildGender|| "", { x: 350, y: 175 });
//     Page5.drawText(children[4]["Child Five"].fifthChildLivingWith || "" , { x: 350, y: 145 });
//     Page5.drawText(children[4]["Child Five"].fifthChildDateOfBirth  || "", { x: 350, y: 115 });
    
//     //the sixth page 
//     Page6.drawText(children[4]["Child Five"].isfifthChildHaveSpecialNeeds || "" , { x: 350, y: 730 });
//     Page6.drawText(children[4]["Child Five"].fifthChildResponsibility ||"" , { x: 350, y: 660 });
//     Page6.drawText(children[4]["Child Five"].sixthChildCheck || "", { x: 350, y: 625 });
//     Page6.drawText(children[5]["Child Six"].sixthChildFirstName || "", { x: 350, y: 565 });
//     Page6.drawText(children[5]["Child Six"].sixthChildSurName || "", { x: 350, y: 535 });
//     Page6.drawText(children[5]["Child Six"].sixthChildGender || "" , { x: 350, y: 505 });
//     Page6.drawText(children[5]["Child Six"].sixthChildLivingWith || "" , { x: 350, y: 475 });
//     Page6.drawText(children[5]["Child Six"].sixthChildDateOfBirth || "", { x: 350, y: 445 });
//     Page6.drawText(children[5]["Child Six"].issixthChildHaveSpecialNeeds || "", { x: 350, y: 400});
//     Page6.drawText(children[5]["Child Six"].sixthChildResponsibility || "", { x: 350, y: 335 });
//     Page6.drawText(courtProceedings.isFacingLegalProceedings || "", { x: 350, y: 285 });
//     Page6.drawText(courtProceedings.legalProceedingsInfo || "", { x: 350, y: 235 });
//     Page6.drawText(courtProceedings.courtApplicationKnown || "" , { x: 350, y: 205});
//     Page6.drawText(courtProceedings.courtApplicationInfo|| "", { x: 350, y: 175 });


//     //the seventh page 
//     Page7.drawText(courtProceedings.maritalStatus || "" , { x: 350, y: 750 });
//     Page7.drawText(yourSolicitorOrMcKenzieFriend.solicitorCheck ||"" , { x: 350, y: 720 });
//     Page7.drawText(yourSolicitorOrMcKenzieFriend.consultationRegardingLegalSupport || "", { x: 350, y: 670 });
//     // Page7.drawText( || "", { x: 350, y: 565 });
//     Page7.drawText(yourSolicitorOrMcKenzieFriend.solicitorLawFirmName || "", { x: 350, y: 535 });
//     Page7.drawText(yourSolicitorOrMcKenzieFriend.solicitorTelephone || "" , { x: 350, y: 505 });
//     Page7.drawText(yourSolicitorOrMcKenzieFriend.solicitorEmail || "" , { x: 350, y: 475 });
//     Page7.drawText(yourSolicitorOrMcKenzieFriend.sendMediationCertificateToSolicitor || "", { x: 350, y: 445 });
//     Page7.drawText("Yes" || "", { x: 350, y: 355});
//     Page7.drawText("Yes" || "", { x: 350, y: 300 });
  

    

   
   


//     // Save the PDF document to a buffer
//     const pdfBytes = await pdfDoc.save();

//     // Save the PDF to the "uploads" folder
//     const pdfSavePath = path.join(__dirname, '../uploads/generated.pdf');
//     fs.writeFileSync(pdfSavePath, pdfBytes);



//     return 'PDF generated and saved successfully';
//   } catch (error) {
//     console.error('Error generating and saving PDF:', error);
//     throw error;
//   }
// };


// Function to authenticate the service account and get the Drive API client



// async function getDriveApiClient() {
//   const auth = new google.auth.GoogleAuth({
//     keyFile: config.credentialFile1, 
//     scopes: ['https://www.googleapis.com/auth/drive'],
//   });

//   const drive = google.drive({
//     version: 'v3',
//     auth: await auth.getClient(),
//   });

//   return drive;
// }




module.exports = router;
