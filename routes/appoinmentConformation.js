const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const decryptTwillioData = require('../middleware/getDataFromTwilio');
const nodemailer = require("nodemailer");
const Company = require("../models/company");
const config = require("../config/config");
const mediator = require('../models/mediator');



const sendAppointment = function (companyData, clientData, bodyDetails) {

    /*
  
     companyData ={companyName , email}
     clientData = {clientName ,email}
  bodyDetails = {caseType , dates ,location}
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

    let datesList = '';
    for (const date of bodyDetails.dates) {
        datesList += `<li>${date}</li>`;
    }


    let info = transporter.sendMail({
        from: config.companyEmail,
        to: clientData.email,
        subject: ` Appointment Mail ${bodyDetails.caseType} case`,
        html: ` <div style="padding: 2vw; direction: ltr">
         <h2>Dear ${clientData.clientName} </h2>

         <p>Thank you for attending your Mediation Information & Assessments Meetings (MIAM). You have both agreed that you wish to attend mediation.</p>

         <p>The next step is for you both to choose a time and date when you are available to attend mediation.
          Your first mediation session will be conducted over <span style="color:blue" >${bodyDetails.location}</span> for the duration of<span style="color:blue" > 2 Hours</span>. 
          If you are unable to use <span style="color:blue" >${bodyDetails.location}</span>, please let me know so that we can explore other options available. </p>
       <p>I can confirm that the application for the Family Mediation Voucher Scheme was successful and there is also Legal Aid funding applied to your case. Due to this, there is no charge payable by either of you for this session.</p>

        <p>The following dates and times are available for your session. If you are able to attend more than one of these sessions then do inform me of this as it improves chances of a time that works for all of us.</p>
   
        <ul style="list-style: decimal inside; font-family: 'Arial', sans-serif; color: red;  font-size: 18px; ">${datesList}</ul>

        <p>Please respond to this email <strong> within 5 working days</strong>  confirming the appointment slots that you are able to attend.
         If you are unable to attend any of the appointment slots, please let me know ASAP so that I can review diaries. </p>
        <p>If you have any questions, please let me know.</p>
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


/*
 
 
=> 😒 send miam 1 link by mail
 /sendMIAM1Link/:id , post   ,     {caseType:"Private || legalAid ", TargetClient:" C1 || C2"} 
 
 
 => 😒 send sms with any body form user
 /sendSMS , post   ,     {clientNumber:"+44 7476 544877",  messageBodyData:""} 
 
  
    => 😒 send sms invitation
    /sendSMSinvitation/:id , post   ,  {"Client":"C1 || C2"}
 
 
    => 😒 send mail invitation
    /sendMailInvitation/:id , post   ,  {"Client":"C1 || C2"}
 

   => 😒 send mediation update by sms
   /sendSMSmediationUpdate/:id , post   ,  {"Client":"C1 || C2"}
 
 
   => 😒 dates for mediation session
   /BOOK_MEDIATION_SESSION/:id , post , {"dates":[" "," "],"location":" "}
 
 
   => 😒 send mediation session record form to mediator
    /sendRecordFormToMediator/:id , post
 
  => 😒 send CIM for both cliens
  /sendCIM_Mail/:id   => post  

   => 😒 send property for both cliens
  /sendProperty_Mail/:id  => post  

   => 😒 send mediation update by sms
  /sendSMSmediationUpdate/:id =>post  , {"Client":"C1 || C2"}  

  => 😒 send appointment mail
  /sendAppointment/:id => post ,{"targetClient":"C1" , "caseType":"private"  , "eventType":"med session" , "dates":["next friday" , " saturday"] , "location" :"zoom"}
    
       
 
 



*/


router.post('/sendAppointment/:id', authMiddleware, async (req, res, next) => {

    let CaseFound;
    try {
        /*
        {
         targetClient:"" , caseType:""  , eventType:"" , dates:["" , ""] , location :""
        }
    
            
      
      bodyDetails = {caseType , dates ,location}
        
        
        */
        const appointmentData = req.body;
        let companyData = {}, clientData = {}, bodyDetails = {};

        bodyDetails.caseType = req.body.caseType
        bodyDetails.dates = req.body.dates
        bodyDetails.location = req.body.location


        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                const currentComp = await Company.findById(req.user._id)

                if (req.body.targetClient == "C1") {
                    clientData.email = CaseFound.MajorDataC1.mail;
                  //  clientData.email = 'abdosamir023023@gmail.com'
                    clientData.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                    companyData.companyName = currentComp.companyName
                    companyData.email = currentComp.email;

                    sendAppointment(companyData, clientData, bodyDetails);
                    res.status(200).json({ "message": "appointment email has been sent ... " })


                }
                else if (req.body.targetClient == "C2") {
                    clientData.email = CaseFound.MajorDataC2.mail;
                    clientData.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                    companyData.companyName = currentComp.companyName
                    companyData.email = currentComp.email;

                    sendAppointment(companyData, clientData, bodyDetails);
                    res.status(200).json({ "message": "appointment email has been sent ... " })


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

                if (req.body.targetClient == "C1") {
                    clientData.email = CaseFound.MajorDataC1.mail;
                    //clientData.email = "abdosamir023023@gmail.com"

                    clientData.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                    companyData.companyName = currentComp_.companyName
                    companyData.email = currentComp_.email


                    s(companyData, clientData, bodyDetails)
                    res.status(200).json({ "message": "appointment email has been sent ... " })


                }
                else if (req.body.targetClient == "C2") {
                    clientData.email = CaseFound.MajorDataC2.mail;
                    clientData.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                    companyData.companyName = currentComp_.companyName
                    companyData.email = currentComp_.email;


                    sendAppointment(companyData, clientData, bodyDetails);
                    res.status(200).json({ "message": "appointment email has been sent ... " })


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