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


const sendMailMIAM1LegalAid = function (companyData, clientData, messageBodyinfo) {

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
      <p> Your Application for Legal Aid was SUCCESSFUL . BEFORE booking you for your Mediation information & Assessment Meeting (MIAM) with one of our family mediators ,
       we need you to complete an online form records basic information about you and your situation. </p>
       <p>AFTER you have filled and SUBMITTED this form , a memeber of out team will back to you to book your appointment</p>
       <p> Please click on the link below :</p>
      <a href='${messageBodyinfo.formUrl}'  style="color:white; padding:5px; "> ${messageBodyinfo.formUrl} </a>
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
  
