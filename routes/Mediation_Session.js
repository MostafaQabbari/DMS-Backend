const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const mediator = require('../models/mediator');
const Company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");
const dateNow = require('../global/dateNow')
const fs = require('fs');
const path = require('path');
const stream = require("stream");
const { google } = require("googleapis");
const { PDFDocument , rgb } = require("pdf-lib");


const MailRecordFormToMed = function (mediatorData, caseData) {

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

    /*
mediatorData.email
mediatorData.name

caseData.caseReference
caseData.caseID
    */


    let info = transporter.sendMail({
        from: config.companyEmail,
        to: mediatorData.email,
        subject: `Mediation Session Record Form for  ${caseData.caseReference} `,
        html: `<body>
        <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
        <h1>Hello ${mediatorData.name}  </h1>
        <h3>Here is the session record form link for ${caseData.caseReference} case </h3>
        <a>${config.baseUrlRecordSessionForm}/${config.RecordSessionForm}/${caseData.caseID}</a>
        <p> Best Regards </p>
        <p>DMS's Team </p> 
        </div>
        </body>`,

    });

}




router.post("/sendRecordFormToMediator/:id", authMiddleware, async (req, res) => {
    try {
        if (req.userRole == "company") {
            let CaseFoundID
            let comp = await Company.findById(req.user._id);

            for (let i = 0; i < comp.cases.length; i++) {


                if (comp.cases[i] == req.params.id) {

                    CaseFoundID = (comp.cases[i])

                }
            }

            if (CaseFoundID) {

                let mediatorData = {}, caseData = {}

                const currentMediator = await Case.findById(req.params.id).populate('connectionData.mediatorID');
                mediatorData.email = currentMediator.connectionData.mediatorID.email;
                mediatorData.name = `${currentMediator.connectionData.mediatorID.firstName} ${currentMediator.connectionData.mediatorID.lastName} `;
                const currentCase = await Case.findById(req.params.id)
                caseData.caseReference = currentCase.Reference
                caseData.caseID = req.params.id

                MailRecordFormToMed(mediatorData, caseData)
                res.status(200).json({ "message": "Mediatio session record has been sent to the mediator " })
            } else {
                res.status(400).json("something wrong with accessing this case ... ")
            }
        }
        else {
            res.status(400).json("something wrong with auth ... ")
        }

    } catch (err) {
        res.status(400).json(err.message)
    }


});

router.patch("/addMediationRecord/:id", async (req, res) => {
    try {


        let currentCase = await Case.findById(req.params.id);
        let mediationRecord = req.body;
        const StringfyData = JSON.stringify(mediationRecord);

        // createMediationRecordUpload(mediationRecord  , currentCase._id);
        
        // // Call the function
        // generateMediationSessionRecord(mediationRecord)
        // .then(pdfBytes => {
        // fs.writeFileSync('mediation_session_record.pdf', pdfBytes);
        // })
        // .catch(error => {
        // console.error('Error:', error);
        // });

        // Call the function
        generateMediationSessionRecord()
        .then(pdfBytes => {
        fs.writeFileSync('mediation_session_record2.pdf', pdfBytes);  
        
        })
        .catch(error => {
        console.error('Error:', error);
        });


        if (req.body.NextSteps.isFurtherSessionPlanned == "Yes") {

            await Case.findByIdAndUpdate(req.params.id, {
                $inc: { mediationSessionsNo: 1 }
            })
            const updatedCase = await Case.findById(req.params.id);
            console.log(updatedCase.mediationSessionsNo)

            let statusRemider = {
                reminderID: `${updatedCase._id}-statusRemider`,
                reminderTitle: `${updatedCase.Reference}-Mediation Session ${updatedCase.mediationSessionsNo}`,
                startDate: dateNow()
            }

            await Case.findByIdAndUpdate(req.params.id, {
                $push: { mediationRecords: StringfyData },
                $set: {
                    'Reminders.statusRemider': statusRemider
                }, status: `Mediation Session ${updatedCase.mediationSessionsNo}`
            })

        }

        else if (req.body.NextSteps.isFurtherSessionPlanned == "No" &&
            req.body.NextSteps.mediationFinishReason == "B - Mediation broken down/no longer suitable"
        ) {

            let statusRemider = {
                reminderID: `${updatedCase._id}-statusRemider`,
                reminderTitle: `${updatedCase.Reference}-Broken`,
                startDate: dateNow()
            }

            await Case.findByIdAndUpdate(req.params.id, {
                $push: { mediationRecords: StringfyData },
                $set: {
                    'Reminders.statusRemider': statusRemider
                }, status: `Broken`, closed: true
            })

        }


        else if (req.body.NextSteps.isFurtherSessionPlanned == "No" &&
            req.body.NextSteps.mediationFinishReason == "A - All/Some matters agreed"
        ) {

            let statusRemider = {
                reminderID: `${updatedCase._id}-statusRemider`,
                reminderTitle: `${updatedCase.Reference}-Agreed`,
                startDate: dateNow()
            }

            await Case.findByIdAndUpdate(req.params.id, {
                $push: { mediationRecords: StringfyData },
                $set: {
                    'Reminders.statusRemider': statusRemider
                }, status: `Agreed`, closed: true
            })

        }
        else if (req.body.NextSteps.isFurtherSessionPlanned == "No" &&
            req.body.NextSteps.mediationFinishReason == "C - Successful - Parenting plan to be written" ||
            req.body.NextSteps.mediationFinishReason == "P - Successful - MOU to be written" ||
            req.body.NextSteps.mediationFinishReason == "S - Successful - Most matters agreed and/or PP and/or MOU to be written"
        ) {

            let statusRemider = {
                reminderID: `${updatedCase._id}-statusRemider`,
                reminderTitle: `${updatedCase.Reference}-Successful`,
                startDate: dateNow()
            }

            await Case.findByIdAndUpdate(req.params.id, {
                $push: { mediationRecords: StringfyData },
                $set: {
                    'Reminders.statusRemider': statusRemider
                }, status: `Successful`, closed: true
            })

        }





        // const companyData = await Case.findById(currentCase._id).populate('connectionData.companyID');
        //   const companyEmail = companyData.connectionData.companyID.email;
        //  const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
        //  let mediatorData = {}, clientData = {}, messageBodyinfo = {};
        //  mediatorData.name = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;
        // const medEmail = medData.connectionData.mediatorID.email;
        //  mediatorData.email = medEmail
        //    const updatedCase = await Case.findById(req.params.id);

        //    const parsedClientData = JSON.parse(updatedCase.client1data)

        //    clientData.fname = parsedClientData.personalContactAndCaseInfo.firstName;
        //    clientData.surName = parsedClientData.personalContactAndCaseInfo.surName;
        //    messageBodyinfo.formUrl = `${config.baseUrlMIAM2}/${config.MIAM_PART_2}/C1/${updatedCase._id}`;

        res.status(200).json({ "message": "Mediation session record has been added" })




    } catch (err) {
        res.status(400).json(err.message)
    }


});


//this function create pdf and folder and then upload it to that google drive folder 
async function createMediationRecordUpload(data  , caseID) {
    try {
        
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
          
            const questionsAndAnswers = [
              { question: 'What is the full name of Client 1?', answer: 'Lewis Lawson' },
              { question: 'What is the full name of Client 1?', answer: 'Lewis Lawson' },
              { question: 'What is the full name of Client 1?', answer: 'Lewis Lawson' },
              { question: 'What is the full name of Client 1?', answer: 'Lewis Lawson' },
              { question: 'What is the full name of Client 1?', answer: 'Lewis Lawson' },
              // ... other questions and answers ...
            ];
          
            const pageHeight = page.getHeight();
            const startX = 50;
            let currentY = pageHeight - 50;
            const questionWidth = 400; // Adjust the width as needed
          

          for (const { question, answer } of questionsAndAnswers) {
            const wrappedQuestion = page.drawText(question, {
              x: startX,
              y: currentY,
              maxWidth: questionWidth,
              lineHeight: 18, // Adjust as needed for spacing
            });

            // Check if wrappedQuestion is defined before accessing its height property
            const questionHeight = wrappedQuestion ? (wrappedQuestion.height || 0) : 0;
            currentY -= questionHeight + 5;

            if (answer) {
              const wrappedAnswer = page.drawText(answer, {
                x: startX,
                y: currentY,
                maxWidth: questionWidth,
                lineHeight: 18,
              });

              // Check if wrappedAnswer is defined before accessing its height property
              currentY -= wrappedAnswer ? (wrappedAnswer.height || 0) + 15 : 15;
            } else {
              currentY -= 15; // Space for empty answer
            }
            
            currentY -= answerHeight; // Add spacing between questions

            // Move to the next page if necessary
            if (currentY <= 50) {
              page.drawText('Continued on next page...', {
                x: startX,
                y: currentY,
                maxWidth: page.getWidth() - startX * 2,
                lineHeight: 18,
              });

              // Add a new page and reset currentY
              currentY = page.getHeight() - 50;
              pdfDoc.addPage();
              page.drawText('Continued from previous page...', {
                x: startX,
                y: currentY,
                maxWidth: page.getWidth() - startX * 2,
                lineHeight: 18,
              });

              currentY -= 20;
            }
          }

          
        const pdfBytes = await pdfDoc.save();
  
        const currentCase = await Case.findById(caseID);

        const companyData = await Case.findById(currentCase._id).populate('connectionData.companyID');

        const sharingGmail = companyData.connectionData.companyID.sharingGmail;

        const folderId = currentCase.folderID;

        console.log(folderId);

  
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
        name: `"MediationSession.pdf"`,
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
      await shareWithPersonalAccount(folderId, "mkabary8@gmail.com" );//the gmail sharing account that belong to the company
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

//   async function generateMediationSessionRecord(data) {
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([600, 800]);
//     const font = await pdfDoc.embedFont('Helvetica');
//     page.setFont(font);
//     page.setFontSize(12);
  
//     const questions = [
//       'Mediation Session Record',
//       'Submitted At',
//       'What is the full name of Client 1?',
//       'What is the full name of Client 2?',
//       'Name of the mediator',
//       'Date of the session',
//       // ... add other questions ...
//     ];
  
//     let yPosition = 750; // Initial y-position for the first question
  
//     for (const question of questions) {
//       const answer = data[question.replace(/[? ]/g, '')]; // Get answer from data
//       const wrappedText = page.drawText(question, { x: 50, y: yPosition, maxWidth: 500 });
//       const textHeight = wrappedText.height;
//       yPosition -= textHeight + 5;
  
//       if (answer) {
//         const wrappedAnswer = page.drawText(answer, { x: 200, y: yPosition, maxWidth: 400 });
//         yPosition -= wrappedAnswer.height + 15;
//       } else {
//         yPosition -= 15; // Space for empty answer
//       }
//     }
  
//     const pdfBytes = await pdfDoc.save();
//     return pdfBytes;
//   }
   

async function generateMediationSessionRecord(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const questionsAndAnswers = [
    { question: 'What is the full name of Client 1?', answer: 'Lewis Lawson' },
    { question: 'What is the full name of Client 1?', answer: 'Lewis Lawson' },
    { question: 'What is the full name of Client 1?', answer: 'Lewis Lawson' },
    { question: 'What is the full name of Client 1?', answer: 'Lewis Lawson' },
    { question: 'What is the full name of Client 1?', answer: 'Lewis Lawson' },
    // ... other questions and answers ...
  ];

  const pageHeight = page.getHeight();
  const startX = 50;
  let currentY = pageHeight - 50;
  const questionWidth = 400; // Adjust the width as needed


for (const { question, answer } of questionsAndAnswers) {
  const wrappedQuestion = page.drawText(question, {
    x: startX,
    y: currentY,
    maxWidth: questionWidth,
    lineHeight: 50, // Adjust as needed for spacing
  });

  // Check if wrappedQuestion is defined before accessing its height property
  const questionHeight = wrappedQuestion ? (wrappedQuestion.height || 0) : 0;
  currentY -= questionHeight + 5;

  if (answer) {
    const wrappedAnswer = page.drawText(answer, {
      x: startX,
      y: currentY,
      maxWidth: questionWidth,
      lineHeight: 50,
    });

    // Check if wrappedAnswer is defined before accessing its height property
    currentY -= wrappedAnswer ? (wrappedAnswer.height || 0) + 15 : 15;
  } else {
    currentY -= 15; // Space for empty answer
  }
  

  // Move to the next page if necessary
  if (currentY <= 50) {
    page.drawText('Continued on next page...', {
      x: startX,
      y: currentY,
      maxWidth: page.getWidth() - startX * 2,
      lineHeight: 18,
    });

    // Add a new page and reset currentY
    currentY = page.getHeight() - 50;
    pdfDoc.addPage();
    page.drawText('Continued from previous page...', {
      x: startX,
      y: currentY,
      maxWidth: page.getWidth() - startX * 2,
      lineHeight: 18,
    });

    currentY -= 20;
  }
}


const pdfBytes = await pdfDoc.save();
    return pdfBytes;
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
  

module.exports = router