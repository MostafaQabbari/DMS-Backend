const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const nodemailer = require("nodemailer");
const Company = require("../models/company");
const config = require("../config/config");
const mediator = require('../models/mediator');
const multer = require('multer');
const fs = require("fs");


const sendCourtForm = function (companyData, clientData, pdfData) {

    /*
  
     companyData ={companyName , email}
     clientData = {clientName ,email}

  
    */
   console.log("from the function",pdfData)

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
        subject: " Court Form",
        html: ` <div style=" text-align: left; ">
       <h1>Dear ${clientData.clientName}  </h1>
   <p>Thank you for using Direct Mediation Services.</p>
   <p>The MIAM certificate signed by the mediator is attached. You will need this when you make your application to court. 
   Please remember this is valid only <strong style="text-decortaion:underline"> for four months </strong> from the date of the certificate</p>
   <p>Below are some links, which you may find helpful:</p>
   <p>Child arrangements order  ( <a href="https://www.gov.uk/government/publications/form-c100-application-under-the-children-act-1989-for-a-child-arrangements-prohibited-steps-specific-issue-section-8-order-or-to-vary-or-discharge">C100 form </a>)</p>
   <p>Financial order  ( <a href="https://www.gov.uk/government/publications/form-a-notice-of-intention-to-proceed-with-an-application-for-a-financial-order">Form A </a>)</p>
<p>For support completing the court forms at no charge, you can contact the <a href="https://www.supportthroughcourt.org/locations">Support Through Court.</a> 
 Also here is the link to <a href="https://www.gov.uk/government/publications/apply-for-help-with-court-and-tribunal-fees">Form EX160</a>  “Apply for help with fees”. If you submit this form, you may not have to pay a court or tribunal fee,
 or you may get some money off.</p>


 <p>We also have a <a href="https://www.directmediationservices.co.uk/sos-contacts/">Signposting</a>  page to external organisations, which provide assistance on varying matters. In addition to this, we have written a general guide to completing the C100 Form, which can be accessed <a href="https://www.directmediationservices.co.uk/c100-application-form/">here</a> .</p>
 
 <p><a href="https://www.directmediationservices.co.uk/wp-content/uploads/2021/12/Closing-letter-20.12.21.pdf">Click here</a> for your closing letter. Please read this carefully.</p>

<p>We have a client's satisfaction survey which you can fill out by clicking the following link: <a href=" https://dms-client-survey.paperform.co/"></a>. All your comments are very much appreciated as they help us to improve our services.</p>
<p>If we can be of any further assistance to you, or you ever wish to return to mediation in the future, please do get in touch with us.</p> 
<p>Kind Regards,</p>
<h3>Direct Mediation Services.</h3>
      <h3>${companyData.companyName}</h3>
      <h3>${companyData.email}</h3>
       </div>`,
        attachments: [
            {
                filename: 'courtForm.pdf',
                content: pdfData
            }
        ]


    }).then((data)=>{ 
            fs.unlinkSync(pdfData.path);
    });
}


const storage = multer.memoryStorage();
const uploadFile = multer({
    storage: multer.diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
            cb(null, `${file.originalname}`)
        }
    })
});

router.post('/sendCourtForm/:id', authMiddleware, uploadFile.single('pdfData'), async (req, res, next) => {

    try {
        let CaseFound;


        const pdfData = req.file;
        const TargetClient = req.body.TargetClient;
        //  console.log(TargetClient)
        let companyData = {}, clientData = {}

        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                const currentComp = await Company.findById(req.user._id)

                if (TargetClient == "C1") {
                    clientData.email = CaseFound.MajorDataC1.mail;
                 //  clientData.email = 'abdosamir023023@gmail.com'
                    clientData.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                    companyData.companyName = currentComp.companyName
                    companyData.email = currentComp.email


                    console.log("before calling the function",pdfData)
                    sendCourtForm(companyData, clientData, pdfData);

                    // .then((pdfData) => {
                    //     try {
                    //         fs.unlinkSync(pdfData.path);
                    //         console.log("File deleted successfully");
                    //     } catch (err) {
                    //         console.error("Error deleting file:", err);
                    //     }
                    // })



                    res.status(200).json({ "message": "court email has been sent ... " })




                }
                else if (TargetClient == "C2") {
                    clientData.email = CaseFound.MajorDataC2.mail;
                    clientData.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                    companyData.companyName = currentComp.companyName
                    companyData.email = currentComp.email;
                    sendCourtForm(companyData, clientData, pdfData);
                    res.status(200).json({ "message": "court email has been sent ... " })




                }
                else {
                    res.status(400).json({ "message": "error with data ... " })
                }

            }
            else {
                res.status(400).json({ "message": "no case found ... " })
            }

        }
        // else if (req.userRole == 'mediator') {
        //     let cases = await mediator.findById(req.user._id).populate('cases');
        //     for (let i = 0; i < cases.cases.length; i++) {
        //         if (cases.cases[i]._id == req.params.id) {

        //             CaseFound = (cases.cases[i])
        //         }
        //     }
        //     if (CaseFound) {

        //         const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');
        //         let currentComp_ = mediatorCompanyData.companyId

        //         if (TargetClient == "C1") {
        //             clientData.email = CaseFound.MajorDataC1.mail;
        //             //clientData.email = "abdosamir023023@gmail.com"

        //             clientData.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
        //             companyData.companyName = currentComp_.companyName
        //             companyData.email = currentComp_.email
        //             sendCourtForm(companyData, clientData, pdfData);
        //             res.status(200).json({ "message": "court email has been sent ... " })



        //         }
        //         else if (TargetClient == "C2") {
        //             clientData.email = CaseFound.MajorDataC2.mail;
        //             clientData.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
        //             companyData.companyName = currentComp_.companyName
        //             companyData.email = currentComp_.email

        //             sendCourtForm(companyData, clientData, pdfData);
        //             res.status(200).json({ "message": "court email has been sent ... " })


        //         }
        //         else {
        //             res.status(400).json({ "message": "error with data ... " })
        //         }
        //     }
        //     else {
        //         res.status(400).json({ "message": "no case found ... " })
        //     }

        // }

        // else {
        //     res.status(400).json({ res: "there is an arror with getting case access for the user" })
        // }



    } catch (err) {
        res.status(400).json(err.message)
    }

});


module.exports = router