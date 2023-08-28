const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const dateNow = require("../global/dateNow");
<<<<<<< HEAD
const fs = require('fs');
const path = require('path');
const stream = require("stream");
const { google } = require("googleapis");
const { PDFDocument } = require("pdf-lib");

=======

const statisticFunctions = require("../global/statisticsFunctions");
const Company = require("../models/company");
>>>>>>> a277691ba9b2ed05255e2863d6a708827924ef35

const sendMailC2Invitation = function (caseDetails, mediationDetails, messageInfo) {

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
           caseDetails.C2mail,
           caseDetails.C2name
           caseDetails.C1name

            mediationDetails.companyName
            mediationDetails.medName

           messageInfo.formUrl
    }
    */


    let info = transporter.sendMail({
        from: config.companyEmail,
        to: caseDetails.C2mail,
        subject: `Invitation to mediation by ${mediationDetails.companyName} `,
        html: `<body>
        <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
        <h1>Hello ${caseDetails.C2name}  </h1>
        <h3>This is an invitation to mediation with your partner  ${caseDetails.C1name} and that's your link to apply your invitation form </h3>
        <a href='${messageInfo.formUrl}' style="color:white; padding:5px; font-size: larger; font-weight: bolder;border:solid 5px">Click here </a>
   
        <p> Best Regards </p>
        <p>${mediationDetails.companyName}'s Team </p>
        <p> Mediator : ${mediationDetails.medName} Team </p>
        
        </div>
        </body>`,

    });

}

const validationMail = function (x) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(x)) {
        return true
    } else {
        return false
    }
}

router.patch("/addC1MIAM2/:id", async (req, res) => {


    try {

        let MIAM2mediator = req.body;
        let MIAM_C1_Date = MIAM2mediator.mediationDetails.DateOfMIAM
        let caseSuitable = MIAM2mediator.FinalComments.isSuitable;   // Yes or No


        

        if (caseSuitable == "Yes") {
            let caseDetails = {}, mediationDetails = {}, messageInfo = {};
            let MajorDataC1 = {
                fName: req.body.mediationDetails.clientFirstName,
                sName: req.body.mediationDetails.clientSurName,
                mail: req.body.mediationDetails.clientEmail,
            }

            // generateAndSavePDF(MIAM2mediator)
            // .then(message => console.log(message))
            // .catch(error => console.error('Error:', error));
            


            let MajorDataC2sName = req.body.mediationDetails.otherPartySurname;

            let currentCase = await Case.findById(req.params.id);

            
            
            let Reference = `${req.body.mediationDetails.clientSurName} & ${currentCase.MajorDataC2.sName}`;
            let statusRemider = {
                reminderID: `${currentCase._id}-statusRemider`,
                reminderTitle: `${currentCase.Reference}-MIAM Part 2-C1`,
                startDate: dateNow()
            }
  

            caseDetails.C2mail = currentCase.MajorDataC2.mail
            caseDetails.C2name = `${currentCase.MajorDataC2.fName} ${currentCase.MajorDataC2.sName}`
            caseDetails.C1name = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`
            const companyData = await Case.findById(req.params.id).populate('connectionData.companyID');
            mediationDetails.companyName = companyData.connectionData.companyID.companyName;
            const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
            mediationDetails.medName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;
            messageInfo.formUrl = `${config.baseUrlC2Invitation}/${config.C2_Invitaion}/${req.params.id}`;
            const stringfyMIAM2Data = JSON.stringify(MIAM2mediator);
            //!currentCase.MIAM2AddedData
            if (true) {

             const updateCase =   await Case.findByIdAndUpdate(req.params.id, {
                    $set: {
                        'MajorDataC1.fName': MajorDataC1.fName,
                        'MajorDataC1.sName': MajorDataC1.sName,
                        'MajorDataC1.mail': MajorDataC1.mail,
                        'MajorDataC2.sName': MajorDataC2sName,
                        'Reminders.statusRemider': statusRemider,
                        'MIAMDates.MIAM_C1_Date': MIAM_C1_Date, 

                    }, MIAM2mediator: stringfyMIAM2Data, MIAM2AddedData: true, status: "MIAM Part 2-C1" ,Reference
                  
                })
<<<<<<< HEAD
                const sharingGmail = companyData.connectionData.companyID.sharingGmail;
            
                await createMIAM2Upload(MIAM2mediator, sharingGmail , currentCase.id );//put email parameter for sharing gmail email company
=======

                const miam1c1  = JSON.parse(updateCase.client1data)
                let MIAM2_C1_Statistics= statisticFunctions.MIAM2_Statistics_C1(MIAM2mediator,updateCase,miam1c1);
                const targetComp = await Case.findById(req.params.id).populate('connectionData.companyID');
               const targetCompID = targetComp.connectionData.companyID._id;
               const stringfyStatiscs=JSON.stringify(MIAM2_C1_Statistics)
                await Company.findByIdAndUpdate(targetCompID, {
                 $push: { statistics: stringfyStatiscs }
                })
>>>>>>> a277691ba9b2ed05255e2863d6a708827924ef35

                if (validationMail(caseDetails.C2mail)) {

                    sendMailC2Invitation(caseDetails, mediationDetails, messageInfo)
                    res.status(200).json({ "message": " MIAM2 has been added and Inviation sent to C2" })
                }
                else {
                    res.status(200).json({ "message": "MIAM2 added but Client 2 did not add valid email to recieve the invitation " })
                }

            }
            else {
                res.status(400).json({ "message": "this MIAM2 has been added before" })
            }

        } else {

            let MajorDataC1 = {
                fName: req.body.mediationDetails.clientFirstName,
                sName: req.body.mediationDetails.clientSurName,
                mail: req.body.mediationDetails.clientEmail,
            }

            let MajorDataC2sName = req.body.mediationDetails.otherPartySurname;

            const stringfyMIAM2Data = JSON.stringify(MIAM2mediator)
            //!currentCase.MIAM2AddedData
            if (true) {

                const updateCase =   await Case.findByIdAndUpdate(req.params.id, {
                    $set: {
                        'MajorDataC1.fName': MajorDataC1.fName,
                        'MajorDataC1.sName': MajorDataC1.sName,
                        'MajorDataC1.mail': MajorDataC1.mail,
                        'MajorDataC2.sName': MajorDataC2sName
                    }, MIAM2mediator: stringfyMIAM2Data,
                    MIAM2AddedData: true,
                    status: "Not suitable for mediation"
                })
<<<<<<< HEAD
                const sharingGmail = companyData.connectionData.companyID.sharingGmail;
            
                await createMIAM2Upload(MIAM2mediator, sharingGmail , currentCase.id );//put email parameter for sharing gmail email company

=======

               const miam1c1  = JSON.parse(updateCase.client1data)
               let MIAM2_C1_Statistics= statisticFunctions.MIAM2_Statistics_C1(MIAM2mediator,updateCase,miam1c1);
               const targetComp = await Case.findById(req.params.id).populate('connectionData.companyID');
              const targetCompID = targetComp.connectionData.companyID._id;
              const stringfyStatiscs=JSON.stringify(MIAM2_C1_Statistics)

               await Company.findByIdAndUpdate(targetCompID, {
                $push: { statistics: stringfyStatiscs }
               })
            
>>>>>>> a277691ba9b2ed05255e2863d6a708827924ef35
                res.status(200).json({ "message": " MIAM2 has been added with Not Suitable status " })
            }
            else {
                res.status(400).json({ "message": "this MIAM2 has been added before" })
            }

        }






    }
    catch (Err) {
        res.status(400).json({ "err": Err.message })
    }

});


//this function create pdf and folder and then upload it to that google drive folder 
async function createMIAM2Upload(MIAM2C1data , sharingGmail , caseID) {
    try {
  
        const filePath = path.join(__dirname, '../uploads/pdfs/MIAM-2-temp.pdf');
        const pdfTemplateBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
    
        const pages = pdfDoc.getPages();
        const Page1 = pages[0];
        const Page2 = pages[1];
  
    
        const font = await pdfDoc.embedFont('Helvetica');
        Page1.setFont(font);
        Page1.setFontSize(12);
        Page2.setFont(font);
        Page2.setFontSize(12);
  
    
        const mediationDetails = MIAM2C1data.mediationDetails;
        const caseDetails      = MIAM2C1data.caseDetails;
        const comments = MIAM2C1data.comments;
        const MediationTypes = MIAM2C1data.MediationTypes;
        const FinalComments = MIAM2C1data.FinalComments;
   
       // // Add client1 data to the PDF document"first page" 
       Page1.drawText(mediationDetails.MediatorName || "", { x: 375, y: 570 });
       Page1.drawText(mediationDetails.DateOfMIAM || "", { x: 375, y: 540 });
       Page1.drawText(mediationDetails.Location || "", { x: 375, y: 510 });
  
       Page1.drawText(caseDetails.privateOrLegalAid || "", { x: 375, y: 415 });
       Page1.drawText(caseDetails.paymentMade || "", { x: 375, y: 385 });
       Page1.drawText(caseDetails.advancePayment|| "", { x: 375, y: 355 });
  
  
       Page1.drawText(comments.MediatorComments|| "", { x: 375, y: 235 });
       Page1.drawText(comments.isClientRequireSignposting|| "", { x: 375, y: 205 });
       Page1.drawText(comments.isDomesticAbuseOrViolence|| "", { x: 375, y: 175 });
       Page1.drawText(comments.isPoliceInvolve|| "", { x: 375, y: 145 });
       Page1.drawText(comments.isSocialServiceInvolve|| "", { x: 375, y: 115 });
       Page1.drawText(comments.isSafeguardingIssues|| "", { x: 415, y: 85 });
       
    
       //the second page 
       Page2.drawText(MediationTypes.isClientWillingToGoWithMediation|| "" , { x: 375, y: 670 });
       Page2.drawText(MediationTypes.mediationFormPreference ||"" , { x: 375, y: 640 });
       Page2.drawText(MediationTypes.confirmLegalDispute|| "", { x: 375, y: 610 });
       Page2.drawText(MediationTypes.isChildInclusiveAppropriate || "", { x: 375, y: 580 });
       Page2.drawText(MediationTypes.informationGivenToClient|| "", { x: 375, y: 505 });
       Page2.drawText(MediationTypes.clientPreference|| "" , { x: 375, y: 445 });
  
       Page2.drawText(FinalComments.isSuitable || "" , { x: 375, y: 300 });
       Page2.drawText(FinalComments.uploadCourtForm|| "", { x: 375, y: 270 });
       Page2.drawText(FinalComments.CommentsToDMS|| "", { x: 375, y: 240});
  
    
  
    
        // Save the PDF document to a buffer
        const pdfBytes = await pdfDoc.save();
  
        const currentCase = await Case.findById(caseID);

        const folderId = currentCase.folderID;

        console.log(folderId);
  
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
  
  

    
  
      // Create a readable stream from the PDF bytes
      const readableStream = new stream.Readable({
        read() {
          this.push(pdfBytes);
          this.push(null);
        },
      });
  
      // Upload the PDF to the created folder
      const fileMetadata = {
        name: `"MIAM-2.pdf"`,
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
      await shareWithPersonalAccount(folderId, sharingGmail );//the gmail sharing account that belong to the company
      //sharingGmail || "mkabary8@gmail.com"
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
   
  
//   const generateAndSavePDF = async (MIAM2C1data) => {
//     try {
//       const filePath = path.join(__dirname, '../uploads/pdfs/MIAM-2-temp.pdf');
//       const pdfTemplateBytes = fs.readFileSync(filePath);
//       const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
  
//       const pages = pdfDoc.getPages();
//       const Page1 = pages[0];
//       const Page2 = pages[1];

  
//       const font = await pdfDoc.embedFont('Helvetica');
//       Page1.setFont(font);
//       Page1.setFontSize(12);
//       Page2.setFont(font);
//       Page2.setFontSize(12);

  
//       const mediationDetails = MIAM2C1data.mediationDetails;
//       const caseDetails      = MIAM2C1data.caseDetails;
//       const comments = MIAM2C1data.comments;
//       const MediationTypes = MIAM2C1data.MediationTypes;
//       const FinalComments = MIAM2C1data.FinalComments;
 
//      // // Add client1 data to the PDF document"first page" 
//      Page1.drawText(mediationDetails.MediatorName || "", { x: 375, y: 570 });
//      Page1.drawText(mediationDetails.DateOfMIAM || "", { x: 375, y: 540 });
//      Page1.drawText(mediationDetails.Location || "", { x: 375, y: 510 });

//      Page1.drawText(caseDetails.privateOrLegalAid || "", { x: 375, y: 415 });
//      Page1.drawText(caseDetails.paymentMade || "", { x: 375, y: 385 });
//      Page1.drawText(caseDetails.advancePayment|| "", { x: 375, y: 355 });


//      Page1.drawText(comments.MediatorComments|| "", { x: 375, y: 235 });
//      Page1.drawText(comments.isClientRequireSignposting|| "", { x: 375, y: 205 });
//      Page1.drawText(comments.isDomesticAbuseOrViolence|| "", { x: 375, y: 175 });
//      Page1.drawText(comments.isPoliceInvolve|| "", { x: 375, y: 145 });
//      Page1.drawText(comments.isSocialServiceInvolve|| "", { x: 375, y: 115 });
//      Page1.drawText(comments.isSafeguardingIssues|| "", { x: 415, y: 85 });
     
  
//      //the second page 
//      Page2.drawText(MediationTypes.isClientWillingToGoWithMediation|| "" , { x: 375, y: 670 });
//      Page2.drawText(MediationTypes.mediationFormPreference ||"" , { x: 375, y: 640 });
//      Page2.drawText(MediationTypes.confirmLegalDispute|| "", { x: 375, y: 610 });
//      Page2.drawText(MediationTypes.isChildInclusiveAppropriate || "", { x: 375, y: 580 });
//      Page2.drawText(MediationTypes.informationGivenToClient|| "", { x: 375, y: 505 });
//      Page2.drawText(MediationTypes.clientPreference|| "" , { x: 375, y: 445 });

//      Page2.drawText(FinalComments.isSuitable || "" , { x: 375, y: 300 });
//      Page2.drawText(FinalComments.uploadCourtForm|| "", { x: 375, y: 270 });
//      Page2.drawText(FinalComments.CommentsToDMS|| "", { x: 375, y: 240});

  

  
//       // Save the PDF document to a buffer
//       const pdfBytes = await pdfDoc.save();
  
//       // Save the PDF to the "uploads" folder
//       const pdfSavePath = path.join(__dirname, '../uploads/generated2.pdf');
//       fs.writeFileSync(pdfSavePath, pdfBytes);
  
  
  
//       return 'PDF generated and saved successfully';
//     } catch (error) {
//       console.error('Error generating and saving PDF:', error);
//       throw error;
//     }
//   };
  
  



module.exports = router;



// const express = require('express');
// const router = express.Router();
// const Case = require('../models/case');
// const { uploadToGoogleDrive } = require('../utils/googleDrive');

// router.patch("/addC1MIAM2/:id", async (req, res) => {
//   try {
//     let MIAM2mediator = req.body;
//     let currentCase = await Case.findById(req.params.id);
//     const stringfyMIAM2Data = JSON.stringify(MIAM2mediator);
//     if (!currentCase.MIAM2AddedData) {
//       // Upload PDF files to Google Drive
//       const c100 = req.files.file1;
//       const formA = req.files.file2;
//       const fileId1 = await uploadToGoogleDrive(c100);
//       const fileId2 = await uploadToGoogleDrive(formA);
      
//       await Case.findByIdAndUpdate(req.params.id, {
//         MIAM2mediator: stringfyMIAM2Data,
//         MIAM2AddedData: true,
//         status: "C1 MIAM Part 2 Applied",
//         file1Id: fileId1,
//         file2Id: fileId2
//       });
  
//       res.json({ "message": "MIAM2 has been added" });
//     } else {
//       res.json({ "message": "This MIAM2 has been added before" });
//     }
//   } catch (err) {
//     res.json({ "err": err.message });
//   }
// });

// module.exports = router;
