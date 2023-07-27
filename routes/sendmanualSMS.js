const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const decryptTwillioData = require('../middleware/getDataFromTwilio');
const nodemailer = require("nodemailer");
const company = require("../models/company");
const config = require("../config/config");
const mediator = require('../models/mediator');

const sendSMS_manual = function (twillioInfo, clientNumber, messageBodyData) {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientNumber = {clientNumber}
      messageBodyData = bodyText
    */
    const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
    const phoneNumber = twillioInfo.twillioNumber;


    x.messages.create({
        body: messageBodyData,
        from: phoneNumber,
        to: clientNumber
    }).then(message => {
        console.log({ message: "form message sent succesfully", messageID: message.sid });
        next();
    }
    ).catch((err) => {

        console.log(err.message)
    });

}

const sendSMS_invitaion = function (twillioInfo, clientNumber, clientName) {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientNumber = clientNumber
      clientName =clientName
 
    */
    const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
    const phoneNumber = twillioInfo.twillioNumber;

    const textBody = `Dear ${clientName}
    You've been sent an inviation to family mediation by email/post .
    Please call our office on ${twillioInfo.twillioNumber}.
    Look forward to hearing from you.
    `


    x.messages.create({
        body: textBody,
        from: phoneNumber,
        to: clientNumber
    }).then(message => {
        console.log({ message: "form message sent succesfully", messageID: message.sid });
        next();
    }
    ).catch((err) => {

        console.log(err.message)
    });

}


const sendMail_Invitation = function (clientDetails, compnayDetails) {

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
           clientDetails.name,
           clientDetails.email
          compnayDetails.phone

    }
    */


    let info = transporter.sendMail({
        from: config.companyEmail,
        to: clientDetails.email,
        subject: `Invitation Mail`,
        html: `<body>
        <div style="text-align: center; padding: 5vw; width: 75%; margin: auto;">
      
        <h3>Dear ${clientDetails.name}</h3>
        <h4> You've been sent an inviation to family mediation by email/post .
        Please call our office on ${compnayDetails.phone}.
        Look forward to hearing from you.</h4>

        </div>
        </body>`,

    });

}

const sendSMS_mediationUpdate = function (twillioInfo, clientData) {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientData = {clientName,clientNumber}
     
    */
    const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
    const phoneNumber = twillioInfo.twillioNumber;
const bodyText= `Dear ${clientData.clientName} ,
I tried to call you but your line was busy. This is about your family mediation case. Please contact me on ${phoneNumber}.
Regards,
Direct Mediation Services`

    x.messages.create({
        body:bodyText,
        from: phoneNumber,
        to: clientData.clientNumber
    }).then(message => {
        console.log({ message: "form message sent succesfully", messageID: message.sid });
        next();
    }
    ).catch((err) => {

        console.log(err.message)
    });

}



router.post('/sendSMS', authMiddleware, decryptTwillioData, async (req, res) => {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientNumber = {clientNumber}
      messageBodyData = {clientName ,companyName, formLink   }
    */

    let clientNumber;
    let messageBodyData = {};

    let twillioInfo = req.twillioInfo;
    console.log(twillioInfo)

    try {
        /*
            {
            clientNumber:"+44 7476 544877",
            messageBodyData:""
            }

        */

        clientNumber = req.body.clientNumber;
        messageBodyData = req.body.messageBodyData

        // clientNumber = "+44 7476 544877"


        sendSMS_manual(twillioInfo, clientNumber, messageBodyData)

        res.status(200).json({ message: "SMS has been sent " })

    } catch (err) {
        res.status(400).json({ message: "error with the end point autherization" })
    }

});

router.post('/sendSMSmediationUpdate/:id', authMiddleware, decryptTwillioData, async (req, res) => {

    let twillioInfo = req.twillioInfo;
    console.log(twillioInfo)

    try {
        /*
        {"Client":"C1"}
        {"Client":"C2"}
        */
        const currentCase = await Case.findById(req.params.id)
        let clientData={}
        if (req.body.Client === "C1") {
   
            clientData.clientNumber = currentCase.MajorDataC1.phoneNumber;
             clientData.clientNumber = "+44 7476 544877"
            clientData.clientName = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`;

            
            sendSMS_mediationUpdate(twillioInfo, clientData)
            res.status(200).json({ message: "SMS has been sent " })


        }
        else if (req.body.Client === "C2") {
            // clientNumber = "+44 7476 544877"
            clientData.clientNumber = currentCase.MajorDataC1.phoneNumber;
            clientData.clientName = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`
            sendSMS_mediationUpdate(twillioInfo, clientData)
            res.status(200).json({ message: "SMS has been sent " })

        }
        else {
            res.status(400).json({ message: "something wrong to choose number of the client" })


        }


    } catch (err) {
        res.status(400).json({ message: "error with the end point autherization" })
    }

});

router.post('/sendSMSinvitation/:id', authMiddleware, decryptTwillioData, async (req, res) => {

    let twillioInfo = req.twillioInfo;
    console.log(twillioInfo)

    try {
        /*
        {"Client":"C1"}
        {"Client":"C2"}
        */
        const currentCase = await Case.findById(req.params.id)
        let clientNumber, clientName;
        console.log(currentCase)
        if (req.body.Client === "C1") {

            //clientNumber = "+44 7476 544877"
            clientNumber = currentCase.MajorDataC1.phoneNumber;
            clientName = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`
            sendSMS_invitaion(twillioInfo, clientNumber, clientName)
            res.status(200).json({ message: "SMS has been sent " })


        }
        else if (req.body.Client === "C2") {
            // clientNumber = "+44 7476 544877"
            clientNumber = currentCase.MajorDataC2.phoneNumber;
            clientName = `${currentCase.MajorDataC2.fName} ${currentCase.MajorDataC2.sName}`
            sendSMS_invitaion(twillioInfo, clientNumber, clientName)
            res.status(200).json({ message: "SMS has been sent " })

        }
        else {
            res.status(400).json({ message: "something wrong to choose number of the client" })


        }


    } catch (err) {
        res.status(400).json({ message: "error with the end point autherization" })
    }

});

router.post('/sendMailInvitation/:id', authMiddleware, async (req, res) => {

    try {
        /*{
        clientDetails.name,
        clientDetails.email
       compnayDetails.phone

      }
     */
        if (req.userRole == "company") {
            const currentCase = await Case.findById(req.params.id);
            const currentComp = await company.findById(req.user._id)

            let clientDetails = {}, compnayDetails = {};

            if (req.body.Client === "C1") {

                clientDetails.email = currentCase.MajorDataC1.mail;
                clientDetails.name = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`;


                compnayDetails.phone = currentComp.phoneNumberTwillio;

                sendMail_Invitation(clientDetails, compnayDetails)
                res.status(200).json({ message: "invitation mail has been sent " })


            }
            else if (req.body.Client === "C2") {

                clientDetails.email = currentCase.MajorDataC2.mail;
                clientDetails.name = `${currentCase.MajorDataC2.fName} ${currentCase.MajorDataC2.sName}`
                compnayDetails.phone = currentComp.phoneNumberTwillio;
                sendMail_Invitation(clientDetails, compnayDetails)
                res.status(200).json({ message: "invitation mail has been sent " })

            }
            else {
                res.status(400).json({ message: "something wrong to choose number of the client" })


            }

        }
        else if (req.userRole == "mediator") {

            let clientDetails = {}, compnayDetails = {};
            const currentCase = await Case.findById(req.params.id);
            const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');
             compnayDetails.phone = mediatorCompanyData.companyId.phoneNumberTwillio;

            if (req.body.Client === "C1") {

                clientDetails.email = currentCase.MajorDataC1.mail;
                clientDetails.email ='abdosamir023023@gmail.com'

                clientDetails.name = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`;

                console.log('🥳🥳', clientDetails, compnayDetails)
                sendMail_Invitation(clientDetails, compnayDetails)
                res.status(200).json({ message: "invitation mail has been sent " })

            }
            else if (req.body.Client === "C2") {

                clientDetails.email = currentCase.MajorDataC2.mail;
                clientDetails.name = `${currentCase.MajorDataC2.fName} ${currentCase.MajorDataC2.sName}`

                sendMail_Invitation(clientDetails, compnayDetails)
                res.status(200).json({ message: "invitation mail has been sent " })

            }
            else {
                res.status(400).json({ message: "something wrong to choose number of the client" })


            }

        }


    } catch (err) {
        res.status(400).json({ message: "error with the end point autherization" })
    }

});




module.exports = router;