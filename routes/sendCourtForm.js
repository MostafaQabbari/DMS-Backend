const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const decryptTwillioData = require('../middleware/getDataFromTwilio');
const nodemailer = require("nodemailer");
const Company = require("../models/company");
const config = require("../config/config");
const mediator = require('../models/mediator');



const sendCourtForm = function (companyData, clientData) {

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
      <h2> Thanks for booking your MIAM. BEFORE your Mediation Information & Assessment Meeting (MIAM) with one of our family mediators, we need you to complete an online form that records basic information about you and your situation. Please click on the link below </h2>
      <h3>PLEASE REMEMBER THAT WHEN YOU BOOK YOUR APPOINTMENT, IF YOU MISS IT, WE WILL NOT BE ABLE TO BOOK YOU ANOTHER.</h3>
      <h3>Direct Mediation Services.</h3>
      <h3>${companyData.companyName}</h3>
      <h3>${companyData.email}</h3>
       </div>`,


    });


    transporter.sendMail(info, (error, info) => {
        if (error) {
            console.log('Error occurred while sending email:', error.message);

        } else {
            console.log('Email sent successfully:', info.messageId);
        }
    });

}



router.post('/sendCourtForm/:id', authMiddleware, async (req, res, next) => {

    let CaseFound;
    try {
        
        const TargetClient = req.body.TargetClient;
        let companyData = {}, clientData = {}, messageBodyinfo = {}

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
                     clientData.email = 'abdosamir023023@gmail.com'
                    clientData.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                    companyData.companyName = currentComp.companyName
                    companyData.email = currentComp.email
                    sendCourtForm(companyData, clientData);
                    res.status(200).json({ "message": "court email has been sent ... " })

              


                }
                else if (TargetClient == "C2") {
                    clientData.email = CaseFound.MajorDataC2.mail;
                    clientData.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                    companyData.companyName = currentComp.companyName
                    companyData.email = currentComp.email;
                    sendCourtForm(companyData, clientData);
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
                let currentComp_ =  mediatorCompanyData.companyId

                if (TargetClient == "C1") {
                    clientData.email = CaseFound.MajorDataC1.mail;
                    //clientData.email = "abdosamir023023@gmail.com"
                  
                    clientData.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                    companyData.companyName = currentComp_.companyName
                    companyData.email = currentComp_.email
                    sendCourtForm(companyData, clientData);
                    res.status(200).json({ "message": "court email has been sent ... " })



                }
                else if (TargetClient == "C2") {
                    clientData.email = CaseFound.MajorDataC2.mail;
                    clientData.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                    companyData.companyName = currentComp_.companyName
                    companyData.email = currentComp_.email
        
                    sendCourtForm(companyData, clientData);
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