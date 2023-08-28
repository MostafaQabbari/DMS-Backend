
const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const dateNow = require("../global/dateNow")

const statisticFunctions = require("../global/statisticsFunctions");
const Company = require("../models/company");

// const validationMail = function (x) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (emailRegex.test(x)) {
//         return true
//     } else {
//         return false
//     }
// }

router.patch("/addC2MIAM2/:id", async (req, res) => {

    try {

        let MIAM2mediator = req.body;
        let MIAM_C2_Date = MIAM2mediator.mediationDetails.DateOfMIAM
        let caseSuitable = MIAM2mediator.FinalComments.isSuitable;   // Yes or No

        if (caseSuitable == "Yes") {

            let MajorDataC2 = {
                fName: req.body.mediationDetails.clientFirstName,
                sName: req.body.mediationDetails.clientSurName,
                mail: req.body.mediationDetails.clientEmail,
            }
            let MajorDataC1sName = req.body.mediationDetails.otherPartySurname;

            let currentCase = await Case.findById(req.params.id);

            let Reference = `${MajorDataC1sName} & ${MajorDataC2.sName}`;
            let statusRemider = {
                reminderID: `${currentCase._id}-statusRemider`,
                reminderTitle: `${currentCase.Reference}-MIAM Part 2-C2`,
                startDate: dateNow()
            }

            const stringfyMIAM2Data = JSON.stringify(MIAM2mediator)
            //!currentCase.MIAM2AddedData
            if (true) {

                const updateCase = await Case.findByIdAndUpdate(req.params.id, {
                    $set: {
                        'MajorDataC2.fName': MajorDataC2.fName,
                        'MajorDataC2.sName': MajorDataC2.sName,
                        'MajorDataC2.mail': MajorDataC2.mail,
                        'MajorDataC1.sName': MajorDataC1sName,
                        'Reminders.statusRemider': statusRemider,
                        'MIAMDates.MIAM_C2_Date': MIAM_C2_Date,
                    }, MIAM2C2: stringfyMIAM2Data, MIAM2C2AddedData: true, status: "MIAM Part 2-C2", Reference
                })
                const miam1c1 = JSON.parse(updateCase.client1data)
                const miam1c2 = JSON.parse(updateCase.client2data)
                //miam2c2, currentCase, miam1c2, miam1c1
                let MIAM2_Statistics_C2 = statisticFunctions.MIAM2_Statistics_C2(MIAM2mediator, updateCase, miam1c2, miam1c1);
                const targetComp = await Case.findById(req.params.id).populate('connectionData.companyID');
                const targetCompID = targetComp.connectionData.companyID._id;
                const stringfyStatiscs = JSON.stringify(MIAM2_Statistics_C2)
                await Company.findByIdAndUpdate(targetCompID, {
                    $push: { statistics: stringfyStatiscs }
                })
                
                const sharingGmail = companyData.connectionData.companyID.sharingGmail;
            
                await createMIAM2Upload(MIAM2mediator, sharingGmail , currentCase.id );//put email parameter for sharing gmail email company

                res.status(200).json({ "message": " MIAM2 has been added " })
            }


        }
        if (caseSuitable == "No") {

            let MajorDataC2 = {
                fName: req.body.mediationDetails.clientFirstName,
                sName: req.body.mediationDetails.clientSurName,
                mail: req.body.mediationDetails.clientEmail,
            }

            let MajorDataC1sName = req.body.mediationDetails.otherPartySurname;

            const stringfyMIAM2Data = JSON.stringify(MIAM2mediator)
            //!currentCase.MIAM2AddedData
            if (true) {

                const updateCase = await Case.findByIdAndUpdate(req.params.id, {
                    $set: {
                        'MajorDataC2.fName': MajorDataC2.fName,
                        'MajorDataC2.sName': MajorDataC2.sName,
                        'MajorDataC2.mail': MajorDataC2.mail,
                        'MajorDataC1.sName': MajorDataC1sName,
                    }, MIAM2C2: stringfyMIAM2Data,
                    MIAM2C2AddedData: true,
                    status: "Not suitable for mediation", Reference, closed: true
                })

                const miam1c1 = JSON.parse(updateCase.client1data)
                const miam1c2 = JSON.parse(updateCase.client2data)
                //miam2c2, currentCase, miam1c2, miam1c1
                let MIAM2_Statistics_C2 = statisticFunctions.MIAM2_Statistics_C2(MIAM2mediator, updateCase, miam1c2, miam1c1);
                const targetComp = await Case.findById(req.params.id).populate('connectionData.companyID');
                const targetCompID = targetComp.connectionData.companyID._id;
                const stringfyStatiscs = JSON.stringify(MIAM2_Statistics_C2)
                await Company.findByIdAndUpdate(targetCompID, {
                    $push: { statistics: stringfyStatiscs }
                })
                const sharingGmail = companyData.connectionData.companyID.sharingGmail;
            
                await createMIAM2Upload(MIAM2mediator, sharingGmail , currentCase.id );//put email parameter for sharing gmail email company

                res.status(200).json({ "message": " MIAM2 has been added with Not Suitable status " })
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


module.exports = router;
