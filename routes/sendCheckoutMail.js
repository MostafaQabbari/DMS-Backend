const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const mediator = require('../models/mediator');
const Company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");

const getNowFormattedDate = require('../global/specialDateFormate');
const dateNow = require('../global/dateNow')
const fs = require('fs');
const path = require('path');
const stream = require("stream");
const { google } = require("googleapis");
const { PDFDocument, rgb } = require("pdf-lib");
const CryptoJS = require("crypto-js");

/*
\let twillioInfo = handleTwillioData(currentCompData.connectionData.companyID);
    let CaseFound = await Case.findById(req.params.id)
    let clientNumber = CaseFound.MajorDataC1.phoneNumber
    // clientNumber = "+447476544877"
    let messageBodyData = `Dear ${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName},
                        An email about your Mediation session  was sent to you. You may need to check your SPAM folder.
                        Thank you.
                        ${compData.name}
                        `
    sendSMSwithChangedBody(twillioInfo, clientNumber, messageBodyData, res)
*/

const sendSMSwithChangedBody = function (twillioInfo, clientNumber, messageBodyData, res) {

    const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
    const phoneNumber = twillioInfo.twillioNumber;


    x.messages.create({
        body: messageBodyData,
        from: phoneNumber,
        to: clientNumber
    }).then(message => {
        console.log({ message: "form message sent succesfully", messageID: message.sid });
    }
    ).catch((err) => {
        console.log(err.message)
        res.status(200).json({ message: `Actions done but could not send SMS to ${clientNumber} due to ${err.message}` })
    });

}
function handleTwillioData(targetComp) {

    const targetCompTwilioData = targetComp.twillioData;
    const data = CryptoJS.AES.decrypt(targetCompTwilioData, 'ourTwillioEncyptionKey');
    const decryptedTwillioData = JSON.parse(data.toString(CryptoJS.enc.Utf8))
    // return = > twillioInfo object by => targetCompany
    return decryptedTwillioData[0]

}

const sendCheckoutMail = function (companyData, clientData, body) {
    /*
    
       companyData ={companyName , email}
       clientData = {clientName ,email},
       body="<h2>Thank you for using our services</h2>"
    
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
        subject: "MIAM I Form",
        html: ` <div style="text-align: left; ">
       <h1>Dear ${clientData.clientName}  </h1>
      
       ${body}
     
      <h3>${companyData.companyName}</h3>
      <h3>${companyData.email}</h3>
       </div>`,

    });


    // transporter.sendMail(info, (error, info) => {
    //     if (error) {
    //         console.log('Error occurred while sending email:', error.message);

    //     } else {
    //         console.log('Email sent successfully:', info.messageId);
    //     }
    // });

}


router.post('/sendCheckoutMail/:id', authMiddleware, async (req, res, next) => {

    let CaseFound;
    try {

        const TargetClient = req.body.TargetClient;
        let companyData = {}, clientData = {};

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
                    //    clientData.email = 'abdo.samir.7719@gmail.com'
                    clientData.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                    companyData.companyName = currentComp.companyName
                    companyData.email = currentComp.email
                    let messageBodyinfo = '<h2>Thank you for using our services , please check your last updates</h2>'


                    sendCheckoutMail(companyData, clientData, messageBodyinfo)


                    let twillioInfo = handleTwillioData(currentComp);

                    let clientNumber = CaseFound.MajorDataC1.phoneNumber
                    // clientNumber = "+447476544877"
                    let messageBodyData = `Dear ${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName},
                    An email with info about your family mediation case was sent to you. You may need to check your SPAM folder. Thank you.
                    
                        ${companyData.companyName}
                        `
                    sendSMSwithChangedBody(twillioInfo, clientNumber, messageBodyData, res)

                    res.status(200).json({ res: " update mail and sms has been sent ..." })




                }
                else if (TargetClient == "C2") {
                    clientData.email = CaseFound.MajorDataC2.mail;
                    clientData.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                    companyData.companyName = currentComp.companyName
                    companyData.email = currentComp.email
                    let messageBodyinfo = '<h2>Thank you for using our services , please check your last updates</h2>'


                    sendCheckoutMail(companyData, clientData, messageBodyinfo)


                    let twillioInfo = handleTwillioData(currentComp);

                    let clientNumber = CaseFound.MajorDataC2.phoneNumber
                    //  clientNumber = "+447476544877"
                    let messageBodyData = `Dear ${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName},
                    An email with info about your family mediation case was sent to you. You may need to check your SPAM folder. Thank you.
                    
                        ${companyData.companyName}
                        `
                    sendSMSwithChangedBody(twillioInfo, clientNumber, messageBodyData, res)

                    res.status(200).json({ res: "MIAM 1 Link has been sent ..." })



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

                    let messageBodyinfo = '<h2>Thank you for using our services , please check your last updates</h2>'


                    sendCheckoutMail(companyData, clientData, messageBodyinfo)
                    let twillioInfo = handleTwillioData(currentComp_);
                    let clientNumber = CaseFound.MajorDataC1.phoneNumber
                    // clientNumber = "+447476544877"
                    let messageBodyData = `Dear ${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName},
                    An email with info about your family mediation case was sent to you. You may need to check your SPAM folder. Thank you.
                    
                        ${companyData.companyName}
                        `
                    sendSMSwithChangedBody(twillioInfo, clientNumber, messageBodyData, res);
                    
                    res.status(200).json({ res: "MIAM 1 Link has been sent ..." })



                }
                else if (TargetClient == "C2") {
                    clientData.email = CaseFound.MajorDataC2.mail;
                    clientData.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                    companyData.companyName = currentComp_.companyName
                    companyData.email = currentComp_.email

                    let messageBodyinfo = '<h2>Thank you for using our services , please check your last updates</h2>'


                    sendCheckoutMail(companyData, clientData, messageBodyinfo)
                    let twillioInfo = handleTwillioData(currentComp_);
                    let clientNumber = CaseFound.MajorDataC1.phoneNumber
                    // clientNumber = "+447476544877"
                    let messageBodyData = `Dear ${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName},
                    An email with info about your family mediation case was sent to you. You may need to check your SPAM folder. Thank you.
                    
                        ${companyData.companyName}
                        `
                    sendSMSwithChangedBody(twillioInfo, clientNumber, messageBodyData, res);
                    res.status(200).json({ res: "MIAM 1 Link has been sent ..." })



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