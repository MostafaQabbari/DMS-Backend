const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const mediator = require('../models/mediator');
const Company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");

const sendAgreementForm = function (clientDetials, companyDetails, caseID) {
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


    let info = transporter.sendMail({
        from: config.companyEmail,
        to: clientDetials.email,
        subject: `Agreement Form`,
        html: ` <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
         <h1>Dear ${clientDetials.clientName}  </h1>
        <p> Thanks for using our services ,  We love to ask you about your agreement for the mediation</p>
        <p>please follow the link below</p>
     
        
        <a>${config.baseUrlC2AgreementForm}/${config.AGREEMENT_FORM}/C2/${caseID}</a>
     
        <h3>Direct Mediation Services</h3>
        <h4>${companyDetails.companyName}</h4>
        <h4>${companyDetails.email}</h4>
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

const notifyCompany = function (companyData, caseData) {

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


    let info = transporter.sendMail({
        from: config.companyEmail,
        to: companyData.email,
        subject: `Agreement form applied for  ${caseData.caseReference} `,
        html: `<body>
        <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
        <h1>Hello ${companyData.companyName}  </h1>
        <h3>We love to inform you that Agreement form of ${caseData.caseReference} case have been applied</h3>
        <p> Best Regards </p>
        <p>DMS's Team </p> 
        </div>
        </body>`,

    });

}



router.post("/sendAgreementForm_C2/:id", authMiddleware, async (req, res) => {

    /*

   clientDetials.email,
   clientDetials.clientName

   companyDetails.companyName
    companyDetails.email

    caseID
   
   */
    try {
        let clientDetials = {}, companyDetails = {}, caseID = ""
        if (req.userRole == "company") {

            let cases = await Company.findById(req.user._id).populate('cases');

            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {


                clientDetials.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                //  clientDetials.email = 'abdo.samir.7719@gmail.com'
                clientDetials.email = CaseFound.MajorDataC2.mail

                companyDetails.companyName = req.user.companyName
                companyDetails.email = req.user.email
                caseID = req.params.id

                sendAgreementForm(clientDetials, companyDetails, caseID)

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


        //!currentCase.C2AgreementApplied
        if (!currentCase.C2AgreementApplied) {

            await Case.findByIdAndUpdate(req.params.id, {
                C2Agreement: StringfyData, C2AgreementApplied: true
            })

            let companyData={} , caseData={}

            const currentComp = await Case.findById(req.params.id).populate('connectionData.companyID');
             companyData.email = currentComp.connectionData.companyID.email;
             companyData.companyName =  currentComp.connectionData.companyID.companyName;

             caseData.caseReference =currentCase.Reference

             notifyCompany(companyData, caseData)
            res.status(200).json({ "message": "Agreement form of C2 has been added " })

        }
        else {
            res.status(400).json({ "message": "this from has been applied before" })

        }
    } catch (err) {
        res.status(400).json(err.message)
    }


})

module.exports = router