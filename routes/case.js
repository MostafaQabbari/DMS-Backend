const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");
const nodemailer = require("nodemailer")
const decryptTwillioData = require('../middleware/getDataFromTwilio');
const config = require("../config/config");



// :{twillioSID, twillioToken, twillioNumber}
const sendingSMS = function (twillioInfo, clientNumber, messageBodyData) {

  /*
    twillioInfo={twillioSID , twillioToken , twillioNumber}
    clientNumber = {clientNumber}
    messageBodyData = {clientName ,companyName, formLink   }
  */
  const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
  const phoneNumber = twillioInfo.twillioNumber;

  const messageBody = `Hello ${messageBodyData.clientName}  ,
   Here is your link to apply to the form ${messageBodyData.formLink} ,
   Best Regards ${messageBodyData.companyName} `
  x.messages.create({
    body: messageBody,
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

const sendMail = function (companyData, clientData, messageBodyinfo) {

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
    subject: "Applying To MIAM Form",
    html: ` <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
     <h1>Dear ${clientData.clientName}  </h1>
    <h2> Follow the next Link to Apply to your form </h2>
    <a href='${messageBodyinfo.formUrl}'  style="color:white; padding:5px; font-size: larger; font-weight: bolder;border:solid 5px">Click here </a>
    <h3>Best Regards</h3>
    <h3>${companyData.companyName}</h3>
    <h3>${companyData.email}</h3>
     </div>`,

    // html: `
    // <div>
    // <h1>Dear ${clientData.clientName}  </h1>
    // <h2> Follow the next Link to Apply to your form </h2>
    // <a href='${messageBodyinfo.formUrl}'>Click here </a>
    // <h3>Best Regards</h3>
    // <h3>${companyData.companyName}</h3>
    // <h3>${companyData.email}</h3>
    // </div>
    //  `,

  });


  transporter.sendMail(info, (error, info) => {
    if (error) {
      console.log('Error occurred while sending email:', error.message);

    } else {
      console.log('Email sent successfully:', info.messageId);
    }
  });

}


router.post('/creatCase', authMiddleware, async (req, res, next) => {

  let companyData = {};
  let clientData = {};
  let messageBodyinfo = {};

  try {
    if (req.userRole == 'company') {
      const { mediatorMail, firstName, surName, phoneNumber, email, dateOfMAIM, location } = req.body;
      const Themediator = await mediator.findOne({ email: mediatorMail });
      const companyId = req.user._id;


      let newCase = await Case.insertMany(
        {
          client1ContactDetails: { firstName, surName, phoneNumber, email, dateOfMAIM, location },
          connectionData: { companyID: req.user._id, mediatorID: Themediator._id }
        });

      // Update the company's cases array with the new case ID
      await Company.findByIdAndUpdate(companyId, { $push: { cases: newCase[0]._id } });
      await mediator.findByIdAndUpdate(Themediator._id, { $push: { cases: newCase[0]._id } });

      clientData.email = email;
      clientData.clientName = `${newCase[0].client1ContactDetails.firstName} ${newCase[0].client1ContactDetails.surName}`;
      messageBodyinfo.formUrl = `${config.baseUrl}/${config.MIAM_PART_1_client1}/${newCase[0]._id}`;
      companyData.companyName = req.user.companyName;
      companyData.email = req.user.email;
      sendMail(companyData, clientData, messageBodyinfo)
      console.log(newCase[0]._id)
      console.log(Themediator.cases)
      res.json({ message: " company has added client " })
    }

    else if (req.userRole == 'mediator') {
      const { firstName, surName, phoneNumber, email, dateOfMAIM, location } = req.body;
      const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');

      let newCase = await Case.insertMany(
        {
          client1ContactDetails: { firstName, surName, phoneNumber, dateOfMAIM, location },
          connectionData: { mediatorID: req.user._id, companyID: mediatorCompanyData.companyId._id }
        });

      // Update the company's cases array with the new case ID
      const compID = mediatorCompanyData.companyId._id;
      const medID = req.user._id
      await Company.findByIdAndUpdate(compID, { $push: { cases: newCase[0]._id } });
      await mediator.findByIdAndUpdate(medID, { $push: { cases: newCase[0]._id } });

      clientData.email = email;
      clientData.clientName = `${newCase[0].client1ContactDetails.firstName} ${newCase[0].client1ContactDetails.surName}`;
      messageBodyinfo.formUrl = `${config.baseUrl}/${config.MIAM_PART_1_client1}/${newCase[0]._id}`;
      console.log("xx")
      companyData.companyName = mediatorCompanyData.companyId.companyName
      companyData.email = mediatorCompanyData.companyId.email
      sendMail(companyData, clientData, messageBodyinfo)
console.log(newCase[0])
      res.json({ message: " mediator has added client " })
    }

    else {
      res.json({ 'message': "error in the role of token" })
    }
  } catch (err) {
    res.json({ message: "error with the end point" })
  }

});


router.post('/sendMIAM1sms', authMiddleware, decryptTwillioData, async (req, res, next) => {

  /*
    twillioInfo={twillioSID , twillioToken , twillioNumber}
    clientNumber = {clientNumber}
    messageBodyData = {clientName ,companyName, formLink   }
  */

  let clientNumber;
  let messageBodyData = {};

  let twillioInfo = req.twillioInfo;

  try {
    const { caseID } = req.body;
    const selectedCase = await Case.findById(caseID);
    const client1ContactDetails =selectedCase.client1ContactDetails
    const compData =  await Case.findById(caseID).populate('connectionData.companyID');
    
    clientNumber= client1ContactDetails.phoneNumber;
    messageBodyData.companyName = compData.connectionData.companyID.companyName
    messageBodyData.clientName = `${client1ContactDetails.firstName} ${client1ContactDetails.surName}`;
    messageBodyData.formLink=`${config.baseUrl}/${config.MIAM_PART_1_client1}/${caseID}`;
    sendingSMS(twillioInfo, clientNumber, messageBodyData)

    res.json({ message: "MIAM 1 link has been sent " })

  } catch (err) {
    res.json({ message: "error with the end point" })
  }

});


router.post('/sendMIAM1mail', authMiddleware, async (req, res, next) => {

  let clientData={};
  let companyData={};
  let messageBodyinfo = {};

  try {
    const { caseID } = req.body;
    const selectedCase = await Case.findById(caseID);
    const client1ContactDetails =selectedCase.client1ContactDetails
    const compData =  await Case.findById(caseID).populate('connectionData.companyID');
    
    clientData.clientName= `${client1ContactDetails.firstName} ${client1ContactDetails.surName}`;
    clientData.email = client1ContactDetails.email
    companyData.companyName = compData.connectionData.companyID.companyName
    companyData.email = compData.connectionData.companyID.email
    messageBodyinfo.formUrl=`${config.baseUrl}/${config.MIAM_PART_1_client1}/${caseID}`;

     sendMail(clientData, companyData, messageBodyinfo)

    res.json({ message: "MIAM 1 link has been sent " })

  } catch (err) {
    res.json({ message: "error with the end point" })
  }

});




module.exports = router;


