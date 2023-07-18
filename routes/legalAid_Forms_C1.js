const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");
const nodemailer = require("nodemailer")
const decryptTwillioData = require('../middleware/getDataFromTwilio');
const config = require("../config/config");
const dateNow = require("../global/dateNow")

const notifyCompany = function (compMail, clientDataName) {

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
        to: compMail,
        subject: `Legal Aid form has for applied for ${clientDataName} `,
        html: `<body>
        <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
        <h3>We love to inform you that Legal Aid form has been applied for ${clientDataName}</h3>
        <p> Best Regards </p>
        <p>DMS's Team </p> 
        </div>
        </body>`,

    });

}

const sendMailMIAM1 = function (companyData, clientData, messageBodyinfo) {
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


    let info = transporter.sendMail({
        from: config.companyEmail,
        to: clientData.email,
        subject: `Applying To ${messageBodyinfo.formType} Form`,
        html: ` <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
       <h1>Dear ${clientData.clientName}  </h1>
      <p> Thanks for booking you MIAM . BEFORE your Mediation information & Assessment Meeting (MIAM) with one of our family mediators ,
       we need you to complete an online form records basic information about you and your situation. </p>
       <p> Please click on the link below :</p>
      <a href='${messageBodyinfo.formUrl}'  style="color:white; padding:5px;"> ${messageBodyinfo.formUrl} </a>
      <h3>Direct Mediation Services</h3>
      <h4>${companyData.companyName}</h4>
      <h4>${companyData.email}</h4>
       </div>`


    });


    transporter.sendMail(info, (error, info) => {
        if (error) {
            console.log('Error occurred while sending email:', error.message);

        } else {
            console.log('Email sent successfully:', info.messageId);
        }
    });

}


router.patch("/passporting_c1/:id", async (req, res) => {


    try {

        let currentCase = await Case.findById(req.params.id);
        let passporting_C1 = req.body
        const StringfyData = JSON.stringify(passporting_C1);

        if (!currentCase.passporting_C1) {

            await Case.findByIdAndUpdate(req.params.id, {
                passporting_C1: StringfyData
            })

            let companyData={} , clientData={},messageBodyinfo={}
   
            const currentComp = await Case.findById(currentCase._id).populate('connectionData.companyID');
             companyData.email = currentComp.connectionData.companyID.email;
             companyData.companyName = currentComp.connectionData.companyID.companyName;


            const updatedCase = await Case.findById(req.params.id);
            clientData.clientName = `${updatedCase.MajorDataC1.fName} ${updatedCase.MajorDataC1.sName}`
            clientData.email = updatedCase.MajorDataC1.mail

            messageBodyinfo.formType = "MIAM 1"
            messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/${req.params.id}`;
            sendMailMIAM1(companyData, clientData, messageBodyinfo);
            notifyCompany(companyData.email, clientData.clientName)

            res.json({ "message": "Passporting form for C1 has been added" })

        }
        else {
            res.json({ "message": "this from has been applied before" })

        }
    } catch (err) {
        res.json(err.message)
    }


});

router.patch("/lowIncome_c1/:id", async (req, res) => {


    try {

        let currentCase = await Case.findById(req.params.id);
        let lowIncome_C1 = req.body
        const StringfyData = JSON.stringify(lowIncome_C1);

        if (!currentCase.lowIncome_C1) {

            await Case.findByIdAndUpdate(req.params.id, {
                lowIncome_C1: StringfyData
            })

            let companyData={} , clientData={},messageBodyinfo={}
   
            const currentComp = await Case.findById(currentCase._id).populate('connectionData.companyID');
             companyData.email = currentComp.connectionData.companyID.email;
             companyData.companyName = currentComp.connectionData.companyID.companyName;


            const updatedCase = await Case.findById(req.params.id);
            clientData.clientName = `${updatedCase.MajorDataC1.fName} ${updatedCase.MajorDataC1.sName}`
            clientData.email = updatedCase.MajorDataC1.mail

            messageBodyinfo.formType = "MIAM 1"
            messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/${req.params.id}`;
            sendMailMIAM1(companyData, clientData, messageBodyinfo);
            notifyCompany(companyData.email, clientData.clientName)

            res.json({ "message": "LowIncome form for C1 has been added" })

        }
        else {
            res.json({ "message": "this from has been applied before" })

        }
    } catch (err) {
        res.json(err.message)
    }


});




router.patch("/passporting_c2/:id", async (req, res) => {


    try {

        let currentCase = await Case.findById(req.params.id);
        let passporting_C2 = req.body
        const StringfyData = JSON.stringify(passporting_C2);

        if (!currentCase.passporting_C2) {

            await Case.findByIdAndUpdate(req.params.id, {
                passporting_C2: StringfyData
            })

            let companyData={} , clientData={},messageBodyinfo={}
   
            const currentComp = await Case.findById(currentCase._id).populate('connectionData.companyID');
             companyData.email = currentComp.connectionData.companyID.email;
             companyData.companyName = currentComp.connectionData.companyID.companyName;


            const updatedCase = await Case.findById(req.params.id);
            clientData.clientName = `${updatedCase.MajorDataC2.fName} ${updatedCase.MajorDataC2.sName}`
            clientData.email = updatedCase.MajorDataC2.mail

            messageBodyinfo.formType = "MIAM 1"
            messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/${req.params.id}`;
            sendMailMIAM1(companyData, clientData, messageBodyinfo);
            notifyCompany(companyData.email, clientData.clientName)

            res.json({ "message": "Passporting form for C2 has been added" })

        }
        else {
            res.json({ "message": "this from has been applied before" })

        }
    } catch (err) {
        res.json(err.message)
    }


});
router.patch("/lowIncome_c2/:id", async (req, res) => {


    try {

        let currentCase = await Case.findById(req.params.id);
        let lowIncome_C2 = req.body
        const StringfyData = JSON.stringify(lowIncome_C2);

        if (!currentCase.lowIncome_C2) {

            await Case.findByIdAndUpdate(req.params.id, {
                lowIncome_C2: StringfyData
            })

            let companyData={} , clientData={},messageBodyinfo={}
   
            const currentComp = await Case.findById(currentCase._id).populate('connectionData.companyID');
             companyData.email = currentComp.connectionData.companyID.email;
             companyData.companyName = currentComp.connectionData.companyID.companyName;


            const updatedCase = await Case.findById(req.params.id);
            clientData.clientName = `${updatedCase.MajorDataC2.fName} ${updatedCase.MajorDataC2.sName}`
            clientData.email = updatedCase.MajorDataC2.mail

            messageBodyinfo.formType = "MIAM 1"
            messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/${req.params.id}`;
            sendMailMIAM1(companyData, clientData, messageBodyinfo);
            notifyCompany(companyData.email, clientData.clientName)

            res.json({ "message": "Low income form for C2 has been added" })

        }
        else {
            res.json({ "message": "this from has been applied before" })

        }
    } catch (err) {
        res.json(err.message)
    }


});





module.exports = router

