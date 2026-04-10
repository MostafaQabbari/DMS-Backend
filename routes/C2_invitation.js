const express = require('express');
const router = express.Router();
const fs = require('fs');
const Case = require('../models/case');
const Company = require('../models/company');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const dateNow = require("../global/dateNow")
const { PDFDocument , rgb  } = require("pdf-lib");
const { google } = require("googleapis");
const stream = require("stream");
const path = require("path");


const sendMailMIAM1 = function (companyData, clientData, messageBodyinfo) {

  /*

   companyData ={companyName , email}
   clientData = {clientName ,email}
   messageBodyinfo = {formUrl ,caseType}

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
    subject: `Applying To ${messageBodyinfo.formType} Form`,
    html: ` <div style=" text-align: left; ">
     <h1>Dear ${clientData.clientName}  </h1>
    <p> Thank you for responding to the invitation to mediation. 
    BEFORE your Mediation Information & Assessment Meeting (MIAM) with one of our family mediators, 
    we need you to complete an online form that records basic information about you and your situation. 
    Without this form completed, we cannot proceed with the appointment. </p>
    <p>YOU HAVE A DEADLINE OF THREE WORKING DAYS TO COMPLETE THIS FORM.</p>
    <p> Please click on the link below:</p>
     
    <a href='${messageBodyinfo.formUrl}'  style="  padding:5px;"> ${messageBodyinfo.formUrl} </a>
    <p>PLEASE REMEMBER THAT WHEN YOU BOOK YOUR APPOINTMENT, IF YOU MISS IT, WE WILL NOT BE ABLE TO BOOK YOU ANOTHER.</p>
    <h3>Direct Mediation Services</h3>
    <h4>${companyData.companyName}</h4>
    <h4>${companyData.email}</h4>
     </div>`


  });


  // transporter.sendMail(info, (error, info) => {
  //   if (error) {
  //     console.log('Error occurred while sending email:', error.message);

  //   } else {
  //     console.log('Email sent successfully:', info.messageId);
  //   }
  // });

}
const sendMailPassporting = function (companyData, clientData, messageBodyinfo) {

  /*

   companyData ={companyName , email}
   clientData = {clientName ,email}
   messageBodyinfo = {formUrl}

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
    subject: `Applying To ${messageBodyinfo.formType} Form`,
    html: ` <div style=" text-align: left; ">
     <h1>Dear ${clientData.clientName}  </h1>
    <p> Thanks for booking you MIAM booking you MIAM  , here is your passporting form </p>
     <p> Please click on the link below :</p>
    <a href='${messageBodyinfo.formUrl}'  style="  padding:5px; "> ${messageBodyinfo.formUrl} </a>
    <h3>Direct Mediation Services</h3>
    <h4>${companyData.companyName}</h4>
    <h4>${companyData.email}</h4>
     </div>`


  });


  // transporter.sendMail(info, (error, info) => {
  //   if (error) {
  //     console.log('Error occurred while sending email:', error.message);

  //   } else {
  //     console.log('Email sent successfully:', info.messageId);
  //   }
  // });

}
const sendMailLowIncome = function (companyData, clientData, messageBodyinfo) {

  /*

   companyData ={companyName , email}
   clientData = {clientName ,email}
   messageBodyinfo = {formUrl}

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
    subject: `Applying To ${messageBodyinfo.formType} Form`,
    html: ` <div style="text-align: left;">
     <h1>Dear ${clientData.clientName}  </h1>
    <p> Thanks for booking you MIAM , here is your low income / no income form </p>
     <p> Please click on the link below :</p>
    <a href='${messageBodyinfo.formUrl}'  style="  padding:5px; "> ${messageBodyinfo.formUrl} </a>
    <h3>Direct Mediation Services</h3>
    <h4>${companyData.companyName}</h4>
    <h4>${companyData.email}</h4>
     </div>`


  });


  // transporter.sendMail(info, (error, info) => {
  //   if (error) {
  //     console.log('Error occurred while sending email:', error.message);

  //   } else {
  //     console.log('Email sent successfully:', info.messageId);
  //   }
  // });

}


const notifyCompanytoCall_C2Refused = function (companyData, clientData) {

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

  /*{

      companyData ={companyName , email}
      caseData.caseReference
      caseData.C2callTimes

         
  }
  */
  let timesList = '';
  if (clientData.C2callTimes) {
    for (const date of clientData.C2callTimes) {
      timesList += `<li>${date}</li>`;
    }
  }


   transporter.sendMail({
    from: config.companyEmail,
    to: companyData.email,
    subject: `C2 Invitation applied for  ${clientData.caseReference} `,
    html: `<body>
      <div style=" text-align: left;">
      <h1>Hello ${companyData.companyName}  </h1>
      <h3>We love to inform you that C2_Invitation of ${clientData.caseReference} case have been applied but he did not accept the invitation</h3>
      <h5>you can call him/her in these times</h5>
      <ul>${timesList}</ul>
      <p> Best Regards </p>
      <p>DMS's Team </p> 
      </div>
      </body>`,

  });

}

const notifyCompanytoCall_C2Confused = function (companyData, clientData) {

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

  /*{

      companyData ={companyName , email}
      caseData.caseReference
      caseData.C2callTimes

         
  }
  */
  let timesList = '';

  if(caseData.C2callTimes)
  {

    for (const date of caseData.C2callTimes) {
      timesList += `<li>${date}</li>`;
    }
  }

   transporter.sendMail({
    from: config.companyEmail,
    to: companyData.email,
    subject: `C2 Invitation applied for  ${clientData.caseReference} `,
    html: `<body>
      <div style=" text-align: left;">
      <h1>Hello ${companyData.companyName}  </h1>
      <h3>We love to inform you that C2_Invitation of ${clientData.caseReference} case have been applied but he confused about the case type </h3>
      <h5>you can call him/her in these times to follow up</h5>
      <ul>${timesList}</ul>
      <p> Best Regards </p>
      <p>DMS's Team </p> 
      </div>
      </body>`,

  });

}


// router.get('/generate-pdf-Invitation-Letter/:id', async (req, res) => {
//   try {
//     const caseId = req.params.id;

//     // Fetch case data from MongoDB
//     const caseData = await Case.findById(caseId).populate('connectionData.companyID');

//     if (!caseData) {
//       return res.status(404).json({ error: 'Case not found' });
//     }

//     // Extract companyID and fetch company data
//     const companyId = caseData.connectionData.companyID;
//     const companyData = await Company.findById(companyId);
//     const sharingGmail = companyData.sharingGmail;
//     const folderID = caseData.folderID;


//     if (!companyData) {
//       return res.status(404).json({ error: 'Company not found' });
//     }

//     // Read the PDF template

//     const filePath = path.join(__dirname, '../uploads/pdfs/Invitation-Letter-DMS-temp.pdf');
//     const pdfTemplateBytes = fs.readFileSync(filePath);
//     const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
//     // const defaultFont = await pdfDoc.embedFont(PDFDocument.Font.Helvetica, { size: 12 });
//     // const defaultFont = await pdfDoc.embedFont({ size: 12 });
//     const font = await pdfDoc.embedFont('Helvetica');
//     // const font = await pdfDoc.embedFont('Helvetica', { size: 3 });
//     //11.97
//     const page1 = pdfDoc.getPage(0);
//     const page2 = pdfDoc.getPage(1);
//     page1.setFont(font);
//     page1.setFontSize(12);
//     page2.setFont(font);
//     page2.setFontSize(12);

    
//     const nameC1 = `${caseData.MajorDataC1.fName} ${caseData.MajorDataC1.sName} `;
//     const nameC2 = `${caseData.MajorDataC2.fName} ${caseData.MajorDataC2.sName}`;
//     const CreatedDate = getCurrentDate();
//     const addressKnown =caseData.majorDataC2FromM1.otherPartyAddressKnown ;
   
//     // Add data to PDF at specific locations (x, y coordinates)
//     page1.drawText(nameC2, { x: 65, y: 720 });

//     try {
//       if (addressKnown === 'Yes' || addressKnown === 'yes') {
//         // Draw text on the page if all variables are defined
//         page1.drawText(caseData.majorDataC2FromM1.otherPartyStreet, { x: 65, y: 700 });
//         page1.drawText(caseData.majorDataC2FromM1.otherPartyCity, { x: 65, y: 686 });
//         page1.drawText(companyData.majorDataC2FromM1.otherPartyPostalCode, { x: 65, y: 670 });
//       } else {
//         // Send a response indicating that address data is missing
//         res.status(400).json({ error: 'Address data is missing' });
//       }
//     } catch (error) {
//       // Handle the error and send an appropriate response
//       console.error('Error while processing address data:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }

//     page1.drawText(CreatedDate, { x: 490, y: 655 });
//     page1.drawText(nameC2, { x: 90, y: 628 }); 
//     page1.drawText(nameC1, { x: 410, y: 587 });
//     page1.drawText(nameC1, { x:  60, y: 532 });
//     page1.drawText(nameC1, { x: 350, y: 490 }); 
//     //
//     page1.drawText(caseData.MajorDataC1.fName, { x: 503, y: 435 });
//     page1.drawText(`-${caseData.MajorDataC1.sName}`, { x:  60, y: 420 });
//     page1.drawText(nameC1, { x: 295, y: 352 });
//     page1.drawText(nameC1, { x: 115, y: 144 }); 

//     page2.drawText('link rshgreytrestsertesrtsert', { x: 215, y: 434 }); 

//     // Save the modified PDF
//     const modifiedPdfBuffer = await pdfDoc.save();

//     // Save the PDF to the "uploads" folder
//     const pdfSavePath = path.join(__dirname, '../uploads/logos/InvitationLetter.pdf');
//     fs.writeFileSync(pdfSavePath, modifiedPdfBuffer);
    

//     // // Send the modified PDF as a response
//     // res.setHeader('Content-Type', 'application/pdf');
//     // res.send(modifiedPdfBuffer);
//     res.status(200).json('true');
//   } catch (err) {
//     console.error(err);

//     if (err.kind === 'ObjectId') {
//       // Handle invalid ObjectId (MongoDB) error
//       return res.status(400).json({ error: 'Invalid ID format' });
//     }

//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/generate-pdf-Invitation-Letter/:id', async (req, res) => {
  try {
    const caseId = req.params.id;

    // Fetch case data from MongoDB
    const caseData = await Case.findById(caseId).populate('connectionData.companyID');

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Extract companyID and fetch company data
    const companyId = caseData.connectionData.companyID;
    const companyData = await Company.findById(companyId);
    const sharingGmail = companyData.sharingGmail;
    const folderID = caseData.folderID;

    if (!companyData) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Read the PDF template
    const filePath = path.join(__dirname, '../uploads/pdfs/Invitation-Letter-DMS-temp.pdf');
    const pdfTemplateBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
    const font = await pdfDoc.embedFont('Helvetica');
    const page1 = pdfDoc.getPage(0);
    const page2 = pdfDoc.getPage(1);
    page1.setFont(font);
    page1.setFontSize(12);
    page2.setFont(font);
    page2.setFontSize(12);

    const nameC1 = `${caseData.MajorDataC1.fName} ${caseData.MajorDataC1.sName} `;
    const nameC2 = `${caseData.MajorDataC2.fName} ${caseData.MajorDataC2.sName}`;
    const CreatedDate = getCurrentDate();
    const addressKnown = caseData.majorDataC2FromM1.otherPartyAddressKnown;

    // Add data to PDF at specific locations (x, y coordinates)
    page1.drawText(nameC2, { x: 65, y: 720 });
    
    try {
      if (addressKnown === 'Yes' || addressKnown === 'yes') {
        // Draw text on the page if all variables are defined
        page1.drawText(caseData.majorDataC2FromM1.otherPartyStreet, { x: 65, y: 700 });
        page1.drawText(caseData.majorDataC2FromM1.otherPartyCity, { x: 65, y: 686 });
        page1.drawText(caseData.majorDataC2FromM1.otherPartyPostalCode, { x: 65, y: 670 });
      } else {
        // Send a response indicating that address data is missing
        return res.status(400).json({ error: 'Address data is missing' });
      }
    } catch (error) {
      // Handle the error and send an appropriate response
      console.error('Error while processing address data:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    page1.drawText(CreatedDate, { x: 490, y: 655 });
    page1.drawText(nameC2, { x: 90, y: 628 }); 
    page1.drawText(nameC1, { x: 410, y: 587 });
    page1.drawText(nameC1, { x:  60, y: 532 });
    page1.drawText(nameC1, { x: 350, y: 490 }); 
    //
    page1.drawText(caseData.MajorDataC1.fName, { x: 503, y: 435 });
    page1.drawText(`-${caseData.MajorDataC1.sName}`, { x:  60, y: 420 });
    page1.drawText(nameC1, { x: 295, y: 352 });
    page1.drawText(nameC1, { x: 115, y: 144 }); 

    page2.drawText(`https://c2-reply-form.vercel.app/C2_reply/:id`, { x: 215, y: 434 }); 

    // Save the modified PDF
    const modifiedPdfBuffer = await pdfDoc.save();

    // // Save the PDF to the "uploads" folder
    // const pdfSavePath = path.join(__dirname, '../uploads/logos/InvitationLetter.pdf');
    // fs.writeFileSync(pdfSavePath, modifiedPdfBuffer);

    const auth = await google.auth.getClient({
      
      keyFile: config.credentialFile1,

      scopes: ['https://www.googleapis.com/auth/drive'], // Scopes required for accessing Google Drive
    });

  

    const drive = google.drive({ version: "v3", auth });


    // Create a readable stream from the PDF bytes
    const readableStream = new stream.Readable({
      read() {
        this.push(modifiedPdfBuffer);
        this.push(null);
      },
    });

    // Upload the PDF to the created folder
    const fileMetadata = {
      name: "Invitation-Letter",
      parents: [folderID],
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

   await shareWithPersonalAccount(folderID, sharingGmail);

    // Send the modified PDF as a response
    res.status(200).json('true');
  } catch (err) {
    console.error(err);

    if (err.kind === 'ObjectId') {
      // Handle invalid ObjectId (MongoDB) error
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Send an appropriate response for other errors
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.patch("/C2_invitation/:id", async (req, res) => {
  let companyData = {}, clientData = {}, messageBodyinfo = {};
  let LAtabelObj;

  try {

    let phoneCallAppointment_C2_C2reply;
    let currentCase = await Case.findById(req.params.id);
    let C2invitation = req.body;
    phoneCallAppointment_C2_C2reply = req.body.phoneCallAppointment


   await createC2ReplyUpload( C2invitation , currentCase );

    let statusRemider = {
      reminderID: `${currentCase._id}-statusRemider`,
      reminderTitle: `${currentCase.Reference}-Invitation to C2 sent`,
      startDate: dateNow()
    }

    //currentCase.status == "MIAM Part 2-C2" && !currentCase.C2invitationApplied

    //!currentCase.C2invitationApplied
    if (true) {

      let MajorDataC2 = {
        fName: C2invitation.InvitationAnswer.firstName,
        sName: C2invitation.InvitationAnswer.surname,
        mail: C2invitation.InvitationAnswer.email,
        //phoneNumber: C2invitation.InvitationAccepted.phone
      }
      let Reference = `${currentCase.MajorDataC1.sName} & ${C2invitation.InvitationAnswer.surname}`;

      const StringfyData = JSON.stringify(C2invitation)

      const updatedCase = await Case.findByIdAndUpdate(req.params.id, {
        $set: {
          'MajorDataC2.fName': MajorDataC2.fName,
          'MajorDataC2.sName': MajorDataC2.sName,
          'MajorDataC2.mail': MajorDataC2.mail,
          'MajorDataC2.phoneNumber': MajorDataC2.phoneNumber,
          'Reminders.statusRemider': statusRemider
        }, C2invitation: StringfyData, C2invitationApplied: true, Reference, phoneCallAppointment_C2_C2reply, status: "Invitation to C2 sent"
      })


      const currentComp = await Case.findById(req.params.id).populate('connectionData.companyID');
      const companyEmail = currentComp.connectionData.companyID.email;

      companyData.companyName = `${currentComp.connectionData.companyID.companyName}`;
      companyData.email = companyEmail

      clientData.email = MajorDataC2.mail
      clientData.clientName = `${MajorDataC2.fName} ${MajorDataC2.sName}`;

      clientData.caseReference = Reference;
      clientData.C2callTimes = phoneCallAppointment_C2_C2reply

      // const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
      // const medEmail = medData.connectionData.mediatorID.email;
      // caseDetails.C1name = `${updatedCase.MajorDataC1.fName} ${updatedCase.MajorDataC1.sName}`
      // mediationDetails.medName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;

      if (req.body.InvitationAnswer.willingToComeToMediation == "No") {
        notifyCompanytoCall_C2Refused(companyData, clientData);
      }
      else if (req.body.InvitationAccepted.privateOrLegailAid == "Private" || req.body.InvitationAccepted.isStillLikeToMakeAnApplicationForLegalAid === "No") {
        await Case.findByIdAndUpdate(req.params.id, {
          caseTypeC2: "Private"
        })
        messageBodyinfo.formType = "MIAM 1"
        messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/C2/${updatedCase._id}`;
        sendMailMIAM1(companyData, clientData, messageBodyinfo);
      }
      else if (
        req.body.InvitationAccepted.privateOrLegal == "Legal Aid" &&
        req.body.InvitationAccepted.willingToMakeLegalAidApplication == "Yes" &&
        req.body.InvitationAccepted.isReceiptOfAnyOfTheseSpecificBenefits == "No" &&
        req.body.InvitationAccepted.isEntitledToLegalAid == "Yes"
      ) {
        console.log("📢📢📢📢📢📢")
        LAtabelObj={
          clientType:"C2",
          firstName:C2invitation.InvitationAnswer.firstName,
          sureName:C2invitation.InvitationAnswer.surname,
          typeOfApplication:"Low Income / No Income",
          status:"Application Received",
          DoB:"",
          postCode:"",
          phoneNo:C2invitation.InvitationAccepted.phone,
          email:C2invitation.InvitationAnswer.email,
          address:"",
          howFoundUs:"",
          surNameOftheOtherPerson:C2invitation.InvitationAnswer.otherPersonSurname,
          caseAbout:"",
        }
        console.log(LAtabelObj)
        await Case.findByIdAndUpdate(req.params.id, {
          caseTypeC2: "Legal Aid - low Income / No Income" ,
          legalAidTableData: {
            C2: JSON.stringify(LAtabelObj)
          },
          //$set:{ 'legalAidTableData.C2': JSON.stringify(LAtabelObj),}
        })
        // messageBodyinfo.formType = "low Income / No Income"
        // messageBodyinfo.formUrl = `${config.baseUrllowIncomeForm}/${config.LOWINCOME_NOINCOME}/C2/${updatedCase._id}`;
        // sendMailLowIncome(companyData, clientData, messageBodyinfo);
      }
      else if (
        req.body.InvitationAccepted.privateOrLegal == "Legal Aid" &&
        req.body.InvitationAccepted.willingToMakeLegalAidApplication == "Yes" &&
        req.body.InvitationAccepted.isReceiptOfAnyOfTheseSpecificBenefits == "Yes"
      ) {
        LAtabelObj={
          clientType:"C2",
          firstName:C2invitation.InvitationAnswer.firstName,
          sureName:C2invitation.InvitationAnswer.surname,
          typeOfApplication:"Passporting",
          status:"Application Received",
          DoB:"",
          postCode:"",
          phoneNo:C2invitation.InvitationAccepted.phone,
          email:C2invitation.InvitationAnswer.email,
          address:"",
          howFoundUs:"",
          surNameOftheOtherPerson:C2invitation.InvitationAnswer.otherPersonSurname,
          caseAbout:"",
        }

        await Case.findByIdAndUpdate(req.params.id, {
          caseTypeC2: "Legal Aid - Passporting",
          legalAidTableData: {
            C2: JSON.stringify(LAtabelObj)
          },
         // $set:{ 'legalAidTableData.C2': JSON.stringify(LAtabelObj),}
        })
        // messageBodyinfo.formType = "Passporting"
        // messageBodyinfo.formUrl = `${config.baseUrlpassportingForm}/${config.PASSPORTING}/C2/${updatedCase._id}`;
        // sendMailPassporting(companyData, clientData, messageBodyinfo);
      }
      else if (
        req.body.InvitationAccepted.privateOrLegal == "Legal Aid" &&
        req.body.InvitationAccepted.willingToMakeLegalAidApplication == "Yes" &&
        req.body.InvitationAccepted.isReceiptOfAnyOfTheseSpecificBenefits == "No" &&
        req.body.InvitationAccepted.isEntitledToLegalAid == "Yes" &&
        req.body.InvitationAccepted.isStillLikeToMakeAnApplicationForLegalAid == "Yes"
      ) {


        notifyCompanytoCall_C2Confused(companyData, clientData)

      }
      // else {
      //   res.status(400).json({ "message": "something missed about case type" })
      // }

      res.status(200).json({ "res": "C2 invitation form has been applies" })
    }
    else {
      res.status(400).json({ "res": "this case has been applied before or not suitable please check it out" })
    }









  } catch (err) {
    res.status(400).json(err.message)
  }


})


async function createC2ReplyUpload(data, caseID ) {
  try {

    const pdfDoc = await PDFDocument.create();
    let pages = pdfDoc.getPages;
    let pageNumber = 0;
    const pageHeight = 841.89;
    pages[pageNumber] = pdfDoc.addPage();
    // console.log(pages[pageNumber])
    
    const BoldFont = await pdfDoc.embedFont('Helvetica-Bold');
    const font = await pdfDoc.embedFont('Helvetica');
    

  
    const questionsAndAnswers = [
      { question: 'Are you willing to come to mediation?', answer: data.InvitationAnswer?.willingToComeToMediation},
      { question: 'First name', answer: data.InvitationAnswer?.firstName },
      { question: 'surname/family name', answer: data.InvitationAnswer?.surname },
      { question: 'Email address', answer: data.InvitationAnswer?.email },
      { question: 'the other person in the conflict first name', answer: data.InvitationAnswer?.otherPersonFirstName },
      { question: 'the other person in the conflict surname/family name', answer: data.InvitationAnswer?.otherPersonSurname},
      { question: 'Are you a private client or you think you might be entitled to legal aid?', answer: data.InvitationAccepted?.privateOrLegal },
      { question: 'Are you willing to make an application for legal aid for family mediation?', answer: data.InvitationAccepted?.willingToMakeLegalAidApplication },
      { question: `Are you in receipt of any of these specific benefits? (Universal Credit, Income Support, Employment and Support Allowance Income-Related, Jobseeker's allowance)`, answer: data.InvitationAccepted?.isReceiptOfAnyOfTheseSpecificBenefits },
      { question: 'Do you think you might be entitled to legal aid because you are on a low income/no income/homeless?', answer: data.InvitationAccepted?.isEntitledToLegalAid },
      { question: 'Would you still like to make an application for legal aid?', answer: data.InvitationAccepted?.isStillLikeToMakeAnApplicationForLegalAid },
      { question: `Telephone number`, answer: data.InvitationAccepted?.phone },
      { question: `the time you would like us to call you back`, answer: data.phoneCallAppointment },
    
    ];
    
        
        const startX = 50;
        let currentY = pageHeight - 50;
        const questionWidth = 500; // Adjust the width as needed
  
  

    
    for (const { question, answer } of questionsAndAnswers) {
      const validQuestion = question || '';
      const validAnswer = answer || '';
    
      // Check if the answer is not an empty string before drawing
      if (validAnswer.trim() !== '') {
        currentY = drawTextBlock(pages[pageNumber], validQuestion, startX, currentY, BoldFont, questionWidth, 25);
    
        // Additional space between Question and Answer
        const gapBetweenQA = 15;
        currentY -= gapBetweenQA;
    
        currentY = drawTextBlock(pages[pageNumber], validAnswer, startX, currentY, font, questionWidth, 25);

        // Additional space between this Q&A and the next
        const gapBetweenBlocks = 25;
        currentY -= gapBetweenBlocks;
      }
    

    
      // Move to the next page if necessary
      if (currentY <= 100) {
        // Add a new page and reset currentY
        pageNumber += 1;
        currentY = pageHeight - 50;
        pages[pageNumber] = pdfDoc.addPage();
    
        currentY -= 20;
      }
    }
    


    const pdfBytes = await pdfDoc.save();

    const currentCase = await Case.findById(caseID);

    const companyData = await Case.findById(currentCase._id).populate('connectionData.companyID');

    const sharingGmail = companyData.connectionData.companyID.sharingGmail;

    const folderId = currentCase.folderID;

    // console.log(folderId);
    // console.log(sharingGmail);


    const auth = await google.auth.getClient({

      keyFile: config.credentialFile1,

      scopes: ['https://www.googleapis.com/auth/drive'], // Scopes required for accessing Google Drive
    });



    const drive = google.drive({ version: "v3", auth });

    // Create a readable stream from the PDF bytes
    const readableStream = new stream.Readable({
      read() {
        this.push(pdfBytes);
        this.push(null);
      },
    });

    // Upload the PDF to the created folder
    const fileMetadata = {
      name: `"C2Reply.pdf"`,
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
    await shareWithPersonalAccount(folderId, sharingGmail);//the gmail sharing account that belong to the company
   
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


function getLinesNumber(text) {
  // Check if 'text' is defined and not null before accessing its 'length' property
  if (text && typeof text === 'string') {
    return text.length / 35;
  } else {
    // Handle the case where 'text' is undefined or not a string
    return 0; // Or some default value or error handling logic
  }
}

const drawTextBlock = (page, text, startX, startY, font, maxWidth, lineHeight) => {
  if (typeof text === 'undefined' || text === null) {
    return startY; // If text is not provided, don't draw and return the original Y-coordinate.
  }
  page.drawText(text, {
    x: startX,
    y: startY,
    font,
    maxWidth,
    lineHeight,
  });
  const numberOfLines = getLinesNumber(text);
  return startY - (lineHeight * numberOfLines);
};




function getCurrentDate() {
  const now = new Date();
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return now.toLocaleDateString('en-US', options);
}



module.exports = router;