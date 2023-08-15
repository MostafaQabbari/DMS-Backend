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
        to: clientData.email,
        subject: " Court Form",
        html: ` <div style=" text-align: center; padding: 5vw; width: 75%; margin: auto;">
       <h1>Dear ${clientData.clientName}  </h1>
   
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


    });


    transporter.sendMail(info, (error, info) => {
        if (error) {
            try {
                fs.unlinkSync(pdfData.path);
                console.log("File deleted successfully");
            } catch (err) {
                console.error("Error deleting file:", err);
            }
            console.log('Error occurred while sending email:', error.message);

        } else {

            try {
                fs.unlinkSync(pdfData.path);
                console.log("File deleted successfully");
            } catch (err) {
                console.error("Error deleting file:", err);
            }

            console.log('Email sent successfully:', info.messageId);
        }
    })

 




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

router.post('/sendCourtForm/:id', authMiddleware, uploadFile.single('pdf'), async (req, res, next) => {

    let CaseFound;
    try {


        const pdfData = req.file;
        //console.log(pdfData)
        const    = req.body.TargetClient;
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
                   // clientData.email = 'abdosamir023023@gmail.com'
                    clientData.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                    companyData.companyName = currentComp.companyName
                    companyData.email = currentComp.email
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
        else if (req.userRole == 'mediator') {
            let cases = await mediator.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {

                const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');
                let currentComp_ = mediatorCompanyData.companyId

                if (TargetClient == "C1") {
                    clientData.email = CaseFound.MajorDataC1.mail;
                    //clientData.email = "abdosamir023023@gmail.com"

                    clientData.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                    companyData.companyName = currentComp_.companyName
                    companyData.email = currentComp_.email
                    sendCourtForm(companyData, clientData, pdfData);
                    res.status(200).json({ "message": "court email has been sent ... " })



                }
                else if (TargetClient == "C2") {
                    clientData.email = CaseFound.MajorDataC2.mail;
                    clientData.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                    companyData.companyName = currentComp_.companyName
                    companyData.email = currentComp_.email

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

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }

});


module.exports = router