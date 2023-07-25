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


    let info = transporter.sendMail({
        from: config.companyEmail,
        to: clientDetials.email,
        subject: `MIAM Invitation`,
        html: ` <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
         <h1>Dear ${clientDetials.clientName}  </h1>
        <p> We love to invite you to the meeting of your MIAM with our mediator by ${meetingDetails.location}</p>
        <p>The following dates and times are available for your MIAM meeting</p>
     
        
        <ul>${datesList}</ul>
     
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
const MediationSessionMail = function (meetingDetails, clientDetials, companyDetails) {
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


    let info = transporter.sendMail({
        from: config.companyEmail,
        to:`${clientDetials.c1email}, ${clientDetials.c2email} `,
        subject: `Mediation Session Invitation`,
        html: ` <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
         <h1>Dear ${clientDetials.c1clientName} & ${clientDetials.c2clientName}  </h1>
        <p> Thanks for using our services , We love to invite you to the mediation session with our mediator by ${meetingDetails.location}</p>
        <p>The following dates and times are available for your MIAM meeting</p>
     
        
        <ul>${datesList}</ul>
     
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
        let meetingDetails={}, clientDetials={}, companyDetails={} ;

        if (req.userRole == "company") {

            let cases = await Company.findById(req.user._id).populate('cases');

            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {


                meetingDetails.dates =req.body.dates
                meetingDetails.location =req.body.location

                clientDetials.clientName=`${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
               // clientDetials.email = 'abdo.samir.7719@gmail.com'
                clientDetials.email=CaseFound.MajorDataC1.mail

                companyDetails.companyName =req.user.companyName
                companyDetails.email = req.user.email


                MailInviationToMediation(meetingDetails, clientDetials, companyDetails)

                res.status(200).json({'meesage':"Invitation Mail has been sent"})
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
        let meetingDetails={}, clientDetials={}, companyDetails={} ;

        if (req.userRole == "company") {

            let cases = await Company.findById(req.user._id).populate('cases');

            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {


                meetingDetails.dates =req.body.dates
                meetingDetails.location =req.body.location

                clientDetials.clientName=`${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
               // clientDetials.email = 'abdo.samir.7719@gmail.com'
                clientDetials.email=CaseFound.MajorDataC2.mail

                companyDetails.companyName =req.user.companyName
                companyDetails.email = req.user.email


                MailInviationToMediation(meetingDetails, clientDetials, companyDetails)

                res.status(200).json({'meesage':"Invitation Mail has been sent"})
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
        let meetingDetails={}, clientDetials={}, companyDetails={} ;

        if (req.userRole == "company") {

            let cases = await Company.findById(req.user._id).populate('cases');

            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {

             meetingDetails.dates =req.body.dates
                meetingDetails.location =req.body.location

                clientDetials.c2clientName=`${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
               // clientDetials.email = 'abdo.samir.7719@gmail.com'
                clientDetials.c2email=CaseFound.MajorDataC2.mail
                clientDetials.c1clientName=`${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                // clientDetials.email = 'abdo.samir.7719@gmail.com'
                 clientDetials.c1email=CaseFound.MajorDataC1.mail
 

                companyDetails.companyName =req.user.companyName
                companyDetails.email = req.user.email


                MediationSessionMail(meetingDetails, clientDetials, companyDetails)

                res.status(200).json({'meesage':"Invitation Mail to the mediation session has been sent"})
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
