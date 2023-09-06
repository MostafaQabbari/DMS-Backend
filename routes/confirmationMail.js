const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");
const nodemailer = require("nodemailer")
const config = require("../config/config");

const confirmationMIAM = function (meetingDetails, clientDetials, companyDetails) {
    /*

    meetingDetails.date
    meetingDetails.startTime
    meetingDetails.type
    meetingDetails.location
    meetingDetails.mediatorName
    meetingDetails.agreementLink

    clientDetials.email,
    clientDetials.clientName

     companyDetails.companyName
     companyDetails.email
    
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
        subject: `Confirmation Mail`,
        html: ` <div style=" text-align: left;">
         <h1>Dear ${clientDetials.clientName}  </h1>

         <p>Thank you for attending your Mediation Information & 
         Assessments Meetings (MIAM). You have both agreed that you wish to attend mediation.</p>

         <p>Here is the online form for the <a style="color:blue;" href='${meetingDetails.agreementLink}'>agreement to mediate</a> . It is important that you read, 
         understand and <span style="color:red;">submit the online form</span>  before attending your mediation. </p>

          <p>We have now allocated you a time for your mediation appointment, based on your availability given during your MIAM, please see below:</p>

          <p>Date : ${meetingDetails.date}</p>
          <p>Start Time : ${meetingDetails.startTime}</p>
          <p>Type of mediation : ${meetingDetails.type}</p>
          <p>Venue : ${meetingDetails.location}</p> 
          <p>Mediator : ${meetingDetails.mediatorName}</p>

          <p>${meetingDetails.zoomLink}</p>

          <p>We ask you to be on time for your appointment. <span style="color:blue;"> We also ask you to confirm your attendance via email, 
          as well as digitally signing the <a style="color:blue;" href='${meetingDetails.agreementLink}'>"Agreement to mediate"</a> , 
          which can be accessed by clicking on the link ahead. <a href="https://www.directmediationservices.co.uk/agreement-mediate/"> Your mediation cannot go ahead if this is not done </a>.</span> </p>

          <p>If you cannot attend your mediation, please inform our team as soon as possible, as you may incur costs. Please <a style="color:blue;" href="https://directmediationservices.co.uk/wp-content/uploads/2019/04/Cancellations-Refund-Policy-1.pdf">click here</a>  to access our cancellations policy.</p>

          <p>If you are a Legal Aid client, and you cancel without a valid reason. or miss your appointment, we may not offer you another Legal Aid funded appointment.</p>

         <p>Kind Regards</p>
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



function extractDateTime(timestamp) {
    const dateObj = new Date(timestamp);

    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // Months are zero-based, so we add 1
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();

    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return {
        date: formattedDate,
        startTime: formattedTime
    };
}


/*
😒post("/BOOK_MEDIATION_SESSION/:id" body = > {textBody : "xxxxxx"}
😒post("/MIAM1_Confirmation_C1/:id"
😒post("/MIAM1_Confirmation_C2/:id"
😒post("/CONFIRM_MEDIATION_SESSION/:id"
 body => {  "date":"2023-12-09T01:00:00Z",  "type":"Shuttle / Face to face",  "location":": Online via WhatsApp / Zoom",   "zoomLink":"" }
*/

router.post("/MIAM1_Confirmation_C1/:id", authMiddleware, async (req, res) => {
    /*

       req.body={
                "date":"",
                "type":"",
                "location":"",
                "zoomLink":"",   
            }
    */
    try {
        let meetingDetails = {}, clientDetials = {}, companyDetails = {};
        let reqBody = req.body
        let formatedDateTimeObject = extractDateTime(reqBody.date);
        meetingDetails.date = formatedDateTimeObject.date
        meetingDetails.startTime = formatedDateTimeObject.startTime
        meetingDetails.type = reqBody.type
        meetingDetails.location = reqBody.location
        if(reqBody.zoomLink)
        {
            meetingDetails.zoomLink = `To join your mediation session please follow this link: ${reqBody.location}`
        }
        else   meetingDetails.zoomLink  =" "

        if (req.userRole == "company") {

            let cases = await Company.findById(req.user._id).populate('cases');

            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {

                const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
                meetingDetails.mediatorName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;
                meetingDetails.agreementLink = `${config.baseUrlC2AgreementForm}/${config.AGREEMENT_FORM}/C1/${req.params.id}`
                clientDetials.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                clientDetials.email = CaseFound.MajorDataC1.mail
               // clientDetials.email = 'abdosamir023023@gmail.com'
                companyDetails.companyName = req.user.companyName
                companyDetails.email = req.user.email


                confirmationMIAM(meetingDetails, clientDetials, companyDetails)

                res.status(200).json({ 'meesage': "Confirmation Mail has been sent" })
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

});

router.post("/MIAM1_Confirmation_C2/:id", authMiddleware, async (req, res) => {


    try {
        let meetingDetails = {}, clientDetials = {}, companyDetails = {};
        let reqBody = req.body
        let formatedDateTimeObject = extractDateTime(reqBody.date);
        meetingDetails.date = formatedDateTimeObject.date
        meetingDetails.startTime = formatedDateTimeObject.startTime
        meetingDetails.type = reqBody.type
        meetingDetails.location = reqBody.location
        meetingDetails.zoomLink = reqBody.zoomLink

        if (req.userRole == "company") {

            let cases = await Company.findById(req.user._id).populate('cases');

            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {

                const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
                meetingDetails.mediatorName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;
                meetingDetails.agreementLink = `${config.baseUrlC2AgreementForm}/${config.AGREEMENT_FORM}/C2/${req.params.id}`
                clientDetials.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                clientDetials.email = CaseFound.MajorDataC2.mail
               // clientDetials.email = 'abdosamir023023@gmail.com'
                companyDetails.companyName = req.user.companyName
                companyDetails.email = req.user.email


                confirmationMIAM(meetingDetails, clientDetials, companyDetails)

                res.status(200).json({ 'meesage': "Confirmation Mail has been sent" })
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

});

router.post("/CONFIRM_MEDIATION_SESSION/:id", authMiddleware, async (req, res) => {


    try {
        let meetingDetails = {}, clientDetials = {}, companyDetails = {};
        let reqBody = req.body
        let formatedDateTimeObject = extractDateTime(reqBody.date);
        meetingDetails.date = formatedDateTimeObject.date
        meetingDetails.startTime = formatedDateTimeObject.startTime
        meetingDetails.type = reqBody.type
        meetingDetails.location = reqBody.location
        if(reqBody.zoomLink)
        {
            meetingDetails.zoomLink = `To join your mediation session please follow this link: ${reqBody.location}`
        }
        else   meetingDetails.zoomLink  =" "

        if (req.userRole == "company") {

            let cases = await Company.findById(req.user._id).populate('cases');

            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {

                const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
                meetingDetails.mediatorName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;
                companyDetails.companyName = req.user.companyName
                companyDetails.email = req.user.email
                //! for c2
                meetingDetails.agreementLink = `${config.baseUrlC2AgreementForm}/${config.AGREEMENT_FORM}/C2/${req.params.id}`
                clientDetials.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                clientDetials.email = CaseFound.MajorDataC2.mail
                clientDetials.email = 'abdosamir023023@gmail.com'
                confirmationMIAM(meetingDetails, clientDetials, companyDetails)
                //! for c1
                meetingDetails.agreementLink = `${config.baseUrlC2AgreementForm}/${config.AGREEMENT_FORM}/C1/${req.params.id}`
                clientDetials.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                clientDetials.email = CaseFound.MajorDataC1.mail
               clientDetials.email = 'hassantarekha@gmail.com'
                confirmationMIAM(meetingDetails, clientDetials, companyDetails)

                res.status(200).json({ 'meesage': "Confirmation Mail has been sent" })
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

});






module.exports = router
