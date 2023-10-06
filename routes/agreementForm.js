const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const mediator = require('../models/mediator');
const Company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");
const { PDFDocument } = require("pdf-lib");
const { google } = require("googleapis");
const stream = require("stream");

const sendAgreementFormC1 = function (clientDetials, companyDetails, caseID) {
    /*

    clientDetials.email,
    clientDetials.clientName

    companyDetails.companyName
     companyDetails.email

     caseID
    
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
        to: clientDetials.email,
        subject: `Agreement Form`,
        html: ` <div style=" text-align: left ;">
         <h1>Dear ${clientDetials.clientName}  </h1>
        <p> Thank you for attending your Mediation Information & Assessments Meetings (MIAM). You have both agreed that you wish to attend mediation.</p>

        <p>Here is the online form for the <a style="color:blue;" href='${config.baseUrlC2AgreementForm}/${config.AGREEMENT_FORM}/C1/${caseID}'>Agreement to mediate</a>  .
         It is important that you read, 
        understand and <span style="color:red;">submit the online form</span>  before attending your mediation. After you have submitted this form,
         your mediator will get in touch with you to book you for a mediation session.</p>

         <p><a style="color:blue;" href='${config.baseUrlC2AgreementForm}/${config.AGREEMENT_FORM}/C1/${caseID}'> Your mediation cannot go ahead if this is not done. </a></p>
     
        
        
     
        <h3>Direct Mediation Services</h3>
        <h4>${companyDetails.companyName}</h4>
        <h4>${companyDetails.email}</h4>
         </div>`


    });


    // transporter.sendMail(info, (error, info) => {
    //     if (error) {
    //         console.log('Error occurred while sending email:', error.message);

    //     } else {
    //         console.log('Email sent successfully:', info.messageId);
    //     }
    // });


}

const sendAgreementFormC2 = function (clientDetials, companyDetails, caseID) {
    /*

    clientDetials.email,
    clientDetials.clientName

    companyDetails.companyName
     companyDetails.email

     caseID
    
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
        to: clientDetials.email,
        subject: `Agreement Form`,
        html: `
        <div style=" text-align: left ;">
        <h1>Dear ${clientDetials.clientName}  </h1>
        
        <p> Thank you for attending your Mediation Information & Assessments Meetings (MIAM). You have both agreed that you wish to attend mediation.</p>

        <p>Here is the online form for the <a style="color:blue;" href='${config.baseUrlC2AgreementForm}/${config.AGREEMENT_FORM}/C2/${caseID}'>Agreement to mediate</a>  .
         It is important that you read, 
        understand and <span style="color:red;">submit the online form</span>  before attending your mediation. After you have submitted this form,
         your mediator will get in touch with you to book you for a mediation session.</p>

         <p><a style="color:blue;" href='${config.baseUrlC2AgreementForm}/${config.AGREEMENT_FORM}/C2/${caseID}'> Your mediation cannot go ahead if this is not done. </a></p>
     
        
     
        <h3>Direct Mediation Services</h3>
        <h4>${companyDetails.companyName}</h4>
        <h4>${companyDetails.email}</h4>
         </div>`


    });


    // transporter.sendMail(info, (error, info) => {
    //     if (error) {
    //         console.log('Error occurred while sending email:', error.message);

    //     } else {
    //         console.log('Email sent successfully:', info.messageId);
    //     }
    // });


}

const notifyCompanyC1 = function (companyData, caseData) {

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
companyData.email
companyData.companyName

caseData.caseReference
    */


     transporter.sendMail({
        from: config.companyEmail,
        to: companyData.email,
        subject: `Agreement_C1 form applied for  ${caseData.caseReference} `,
        html: `<body>
        <div style="text-align: left;">
        <h1>Hello ${companyData.companyName}  </h1>
        <h3>We love to inform you that Agreement form of ${caseData.caseReference} case have been applied</h3>
        <p> Best Regards </p>
        <p>DMS's Team </p> 
        </div>
        </body>`,

    });

}

const notifyCompanyC2 = function (companyData, caseData) {

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
companyData.email
companyData.companyName

caseData.caseReference
    */


     transporter.sendMail({
        from: config.companyEmail,
        to: companyData.email,
        subject: `Agreement_C2 form applied for  ${caseData.caseReference} `,
        html: `<body>
        <div style="text-align: left;">
        <h1>Hello ${companyData.companyName}  </h1>
        <h3>We love to inform you that Agreement form of ${caseData.caseReference} case have been applied</h3>
        <p> Best Regards </p>
        <p>DMS's Team </p> 
        </div>
        </body>`,

    });

}



router.post("/sendAgreementForm/:id", authMiddleware, async (req, res) => {

    /*

   clientDetials.email,
   clientDetials.clientName

   companyDetails.companyName
    companyDetails.email

    caseID
    {targetClient  :  C1/C2}
    📢patch("/replaceMediator/:id" ,  { "mediatorMail" : " "}
    📢.post("/sendAgreementForm/:id",  {targetClient  :  C1|C2}
   */
    try {
        let clientDetials1 = {}, clientDetials2 = {}, companyDetails = {}, caseID = "";
        let targetClient=req.body.targetClient
        if (req.userRole == "company") {

            let cases = await Company.findById(req.user._id).populate('cases');

            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {


                clientDetials2.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                clientDetials2.email = CaseFound.MajorDataC2.mail

                clientDetials1.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                clientDetials1.email = CaseFound.MajorDataC1.mail
              //  clientDetials1.email = "abdosamir023023@gmail.com"
                //clientDetials2.email = "abdosamir023023@gmail.com"
                companyDetails.companyName = req.user.companyName
                companyDetails.email = req.user.email
                caseID = req.params.id;

                if(targetClient=="C1")
                {

                    sendAgreementFormC1(clientDetials1, companyDetails, caseID)
                }
               else if(targetClient=="C2")
                {

                    sendAgreementFormC2(clientDetials2, companyDetails, caseID)
                }
                else{
                    res.status(400).json({ 'meesage': "please select target client" })
                }


                res.status(200).json({ 'meesage': "Agreement form Mail has been sent" })
            }
            else {
                res.status(400).json(" you don't have the access on this case ")
            }

        }
        else {
            res.status(400).json("err with user Auth")
        }

    } catch (err) {
        res.status(400).json(err.message)
    }


})



router.patch("/addAgreement_C2/:id", async (req, res) => {


    try {
        let currentCase = await Case.findById(req.params.id);
        let C2Agreement = req.body
        const StringfyData = JSON.stringify(C2Agreement)
        
        await createAgreementFormUpload( C2Agreement , currentCase );

        //!currentCase.C2AgreementApplied
        if (true) {

            await Case.findByIdAndUpdate(req.params.id, {
                C2Agreement: StringfyData, C2AgreementApplied: true
            })

            let companyData = {}, caseData = {}

            const currentComp = await Case.findById(req.params.id).populate('connectionData.companyID');
            companyData.email = currentComp.connectionData.companyID.email;
            companyData.companyName = currentComp.connectionData.companyID.companyName;

            caseData.caseReference = currentCase.Reference

            notifyCompanyC2(companyData, caseData)
            res.status(200).json({ "message": "Agreement form of C2 has been added " })

        }
        else {
            res.status(400).json({ "message": "this from has been applied before" })

        }
    } catch (err) {
        res.status(400).json(err.message)
    }


})


router.patch("/addAgreement_C1/:id", async (req, res) => {


    try {
        let currentCase = await Case.findById(req.params.id);
        let C1Agreement = req.body
        const StringfyData = JSON.stringify(C1Agreement)
        
        await createAgreementFormUpload( C1Agreement , currentCase );

        //!currentCase.C1AgreementApplied
        if (true) {

            await Case.findByIdAndUpdate(req.params.id, {
                C1Agreement: StringfyData, C1AgreementApplied: true
            })

            let companyData = {}, caseData = {}

            const currentComp = await Case.findById(req.params.id).populate('connectionData.companyID');
            companyData.email = currentComp.connectionData.companyID.email;
            companyData.companyName = currentComp.connectionData.companyID.companyName;

            caseData.caseReference = currentCase.Reference

            notifyCompanyC1(companyData, caseData)
            res.status(200).json({ "message": "Agreement form of C1 has been added " })

        }
        else {
            res.status(400).json({ "message": "this from has been applied before" })

        }
    } catch (err) {
        res.status(400).json(err.message)
    }


})




async function createAgreementFormUpload(data, caseID ) {
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
        { question: 'client Declaration Agreed', answer: data?.clientDeclarationAgreed},
        { question: 'online Mediation Agreed', answer: data?.onlineMediationAgreed },
        { question: 'private Or Legal', answer: data?.privateOrLegal },
        { question: 'legalAid Agreed', answer: data?.legalAidAgreed },
        { question: 'payment Agreed', answer: data?.paymentAgreed },
        { question: 'complaints Agreed', answer: data?.complaintsAgreed},
        { question: 'First name', answer: data?.personalDetails?.firstName },
        { question: 'Surname', answer: data?.personalDetails?.surname },
        { question: `contactNumber`, answer: data?.personalDetails?.contactNumber },
        { question: 'Email Address', answer: data?.emailAddress },

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

      

      const base64Signature = data.personalDetails.electronicSignature;
      const imageBytes = Buffer.from(base64Signature, 'base64');
      const signaturePage = pdfDoc.getPage(0);

      signaturePage.drawText('client signature', { x: 50, y: 250 });


        try {
          const pdfImage = await pdfDoc.embedPng(imageBytes);
      
          const xPosition = 50; 
          const yPosition = 200; 
      
          signaturePage.drawImage(pdfImage, {
            x: xPosition,
            y: yPosition,
            width: 250,
            height: 40,
          });
        } catch (error) {
          console.error('Error embedding PNG image:', error);
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
        name: `"FormAgreement.pdf"`,
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

module.exports = router