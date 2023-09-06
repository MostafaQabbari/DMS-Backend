const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");
const nodemailer = require("nodemailer")
const config = require("../config/config");

const MailInviationToMediation = function (meetingDetails, clientDetials, companyDetails) {
    /*

    meetingDetails.dates
    meetingDetails.location

    clientDetials.email,
    clientDetials.clientName

    companyDetails.companyName
     companyDetails.email
    
    */
    let datesList = '';
    for (const date of meetingDetails.dates) {
        datesList += `<li>${date}</li>`;
    }

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
        subject: `MIAM Invitation`,
        html: ` <div style=" text-align: left;">
         <h1>Dear ${clientDetials.clientName}  </h1>
        <p> We love to invite you to the meeting of your MIAM with our mediator by ${meetingDetails.location}</p>
        <p>The following dates and times are available for your MIAM meeting</p>
     
        
        <ul>${datesList}</ul>
     
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
const MediationSessionMail = function (meetingDetails, clientDetials, companyDetails ,textBody) {
    /*

    meetingDetails.dates
    meetingDetails.location

    clientDetials.c1.email,
    clientDetials.c1.clientName
    clientDetials.c2.email,
    clientDetials.c2.clientName

     companyDetails.companyName
     companyDetails.email
    
    */
    let datesList = '';
    for (const date of meetingDetails.dates) {
        datesList += `<li>${date}</li>`;
    }

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

    let mailList = `${clientDetials.c1email}, ${clientDetials.c2email}`
//console.log("👆👆👆👆",mailList)

     transporter.sendMail({
        from: config.companyEmail,
        to:`${mailList}`,
        subject: `Mediation Session Invitation`,
        html: ` <div style="padding: 2vw; direction: ltr">
         <h2>Dear ${clientDetials.c1clientName} & ${clientDetials.c2clientName}  </h2>

         <p>Thank you for attending your Mediation Information & Assessments Meetings (MIAM). You have both agreed that you wish to attend mediation.</p>

         <p>The next step is for you both to choose a time and date when you are available to attend mediation.
          Your first mediation session will be conducted over <span style="color:blue" >${meetingDetails.location}</span> for the duration of<span style="color:blue" > 2 Hours</span>. 
          If you are unable to use <span style="color:blue" >${meetingDetails.location}</span>, please let me know so that we can explore other options available. </p>
       <p>${textBody}.</p>

        <p>The following dates and times are available for your session. If you are able to attend more than one of these sessions then do inform me of this as it improves chances of a time that works for all of us.</p>
   
        <ul style="list-style: decimal inside; font-family: 'Arial', sans-serif; color: red;  font-size: 18px; ">${datesList}</ul>

        <p>Please respond to this email <strong> within 5 working days</strong>  confirming the appointment slots that you are able to attend.
         If you are unable to attend any of the appointment slots, please let me know ASAP so that I can review diaries. </p>
        <p>If you have any questions, please let me know.</p>
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


router.post("/MIAM1_Meeting_C1/:id", authMiddleware, async (req, res) => {
    /*

    {
        dates:["",""],
        location:""
    }
      

    meetingDetails.dates
    meetingDetails.location

    clientDetials.email,
    clientDetials.clientName

    companyDetails.companyName
     companyDetails.email
    
    
    */

    try {
        let meetingDetails = {}, clientDetials = {}, companyDetails = {};

        if (req.userRole == "company") {

            let cases = await Company.findById(req.user._id).populate('cases');

            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {


                meetingDetails.dates = req.body.dates
                meetingDetails.location = req.body.location

                clientDetials.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                // clientDetials.email = 'abdo.samir.7719@gmail.com'
                clientDetials.email = CaseFound.MajorDataC1.mail

                companyDetails.companyName = req.user.companyName
                companyDetails.email = req.user.email


                MailInviationToMediation(meetingDetails, clientDetials, companyDetails)

                res.status(200).json({ 'meesage': "Invitation Mail has been sent" })
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

router.post("/MIAM1_Meeting_C2/:id", authMiddleware, async (req, res) => {


    try {
        let meetingDetails = {}, clientDetials = {}, companyDetails = {};

        if (req.userRole == "company") {

            let cases = await Company.findById(req.user._id).populate('cases');

            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {


                meetingDetails.dates = req.body.dates
                meetingDetails.location = req.body.location

                clientDetials.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                // clientDetials.email = 'abdo.samir.7719@gmail.com'
                clientDetials.email = CaseFound.MajorDataC2.mail

                companyDetails.companyName = req.user.companyName
                companyDetails.email = req.user.email


                MailInviationToMediation(meetingDetails, clientDetials, companyDetails)

                res.status(200).json({ 'meesage': "Invitation Mail has been sent" })
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

router.post("/BOOK_MEDIATION_SESSION/:id", authMiddleware, async (req, res) => {


    try {
        let meetingDetails = {}, clientDetials = {}, companyDetails = {};
        let textBody= req.body.textBody

        if (req.userRole == "company") {

            let cases = await Company.findById(req.user._id).populate('cases');

            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {

                meetingDetails.dates = req.body.dates
                meetingDetails.location = req.body.location

                clientDetials.c2clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                // clientDetials.email = 'abdo.samir.7719@gmail.com'
                clientDetials.c2email = CaseFound.MajorDataC2.mail
                clientDetials.c1clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                // clientDetials.email = 'abdo.samir.7719@gmail.com'
                clientDetials.c1email = CaseFound.MajorDataC1.mail


                companyDetails.companyName = req.user.companyName
                companyDetails.email = req.user.email

               // console.log("🙌🙌",meetingDetails,"🙌🙌", clientDetials,"🙌🙌", companyDetails)


                MediationSessionMail(meetingDetails, clientDetials, companyDetails ,textBody)

                res.status(200).json({ 'meesage': "Invitation Mail to the mediation session has been sent" })
            }
  

        }
        if (req.userRole == "mediator") {

            let cases = await mediator.findById(req.user._id).populate('cases');

            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');
                //let currentComp_ =  mediatorCompanyData.companyId

                meetingDetails.dates = req.body.dates
                meetingDetails.location = req.body.location

                clientDetials.c2clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                clientDetials.c2email = CaseFound.MajorDataC2.mail
                clientDetials.c1clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                clientDetials.c1email = CaseFound.MajorDataC1.mail
                
               // clientDetials.c2email = 'abdo.samir.55@gmail.com'
                 //clientDetials.c1email = 'abdosamir023023@gmail.com'

                companyDetails.companyName = mediatorCompanyData.companyId.companyName
                companyDetails.email = mediatorCompanyData.companyId.email


                MediationSessionMail(meetingDetails, clientDetials, companyDetails , textBody)

                res.status(200).json({ 'meesage': "Invitation Mail to the mediation session has been sent" })
            }
            else {
                res.status(400).json(" you don't have the access on this case ")
            }

        }
    

    } catch (err) {
        res.status(400).json(err.message)
    }

});






module.exports = router
