const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer")
const twillioMiddleware = require('../middleware/getDataFromPromise');
const config = require("../config/config");



// :{twillioSID, twillioToken, twillioNumber}
const sendingSMS = function (twillioInfo, clientNumber, messageBodyData) {


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
  )

}

const sendMail = function (companyData,clientData,messageBodyinfo) {

  /*

   companyData ={companyName , email}
   clientData = {clientName ,email}
   messageBodyinfo = {formUrl}

  */

  let transporter = nodemailer.createTransport({
    //service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use TLS
    auth: {
      user: config.companyEmail,
      pass: config.appPassWord,
    },
    // tls: {
    //   ciphers: 'SSLv3',
    // },
  });


  let info =  transporter.sendMail({

    to: clientData.email ,
    subject: "Applying To MIAM Form",
    html: `
    <div>
    <h1>Dear ${clientData.clientName}  </h1>
    <h2> Follow the next Link to Apply to your form </h2>
    <a href='${messageBodyinfo.formUrl}'>Click here </a>
    <h3>Best Regards</h3>
    <h3>${companyData.companyName}</h3>
    <h3>${companyData.email}</h3>
    </div>
     `,

  });

}



router.post('/createCaseSMS', authMiddleware, twillioMiddleware, async (req, res, next) => {

  let twillioInfo;
  let clientNumber;
  let messageBodyData = {};
  twillioInfo = req.twillioInfo;
  try {
    const { firstName, surName, phoneNumber,email, dateOfMAIM, location } = req.body;

    if (req.userRole == 'company') {
      let newCase = await Case.insertMany(
        {
          client1ContactDetails: { firstName, surName, phoneNumber,email, dateOfMAIM, location },
          connectionData: { companyID: req.user._id }
        })

      const companyId = req.user._id;

      // Update the company's cases array with the new case ID
      await Company.findByIdAndUpdate(companyId._id, { $push: { cases: newCase._id } });

      clientNumber = phoneNumber;
      messageBodyData.clientName = `${newCase[0].client1ContactDetails.firstName} ${newCase[0].client1ContactDetails.surName}`;
      messageBodyData.formLink = `${config.baseUrl}/addClient1/${newCase[0]._id}`;
      messageBodyData.companyName = req.user.companyName;
      sendingSMS(twillioInfo, clientNumber, messageBodyData)
      res.json({ message: " company has added client " })
    }
    else if (req.userRole == 'mediator') {
      const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId')

      let newCase = await Case.insertMany(
        {
          client1ContactDetails: { firstName, surName, phoneNumber, dateOfMAIM, location },
          connectionData: { mediatorID: req.user._id, companyID: mediatorCompanyData.companyId._id }
        });


       // Update the company's cases array with the new case ID
      await Company.findByIdAndUpdate(mediatorCompanyData.companyId, { $push: { cases: newCase._id } });

      clientNumber = phoneNumber;
      messageBodyData.clientName = `${newCase[0].client1ContactDetails.firstName} ${newCase[0].client1ContactDetails.surName}`;
      messageBodyData.formLink = `${config.baseUrl}/addClient1/${newCase[0]._id}`;
      messageBodyData.companyName = mediatorCompanyData.companyId.companyName
      sendingSMS(twillioInfo, clientNumber, messageBodyData)
      res.json({ message: " mediator has added client " })
    }

    else {
      res.json({ 'message': "error in the role of token" })
    }
  } catch (err) {
    res.json({ message: "error with the end point" })
  }

});


router.post('/createCaseMail', authMiddleware, async (req, res, next) => {


  let companyData={};
  let clientData={};
  let messageBodyinfo = {};

  try {
    const { firstName, surName, phoneNumber,email, dateOfMAIM, location } = req.body;

    if (req.userRole == 'company') {
      let newCase = await Case.insertMany(
        {
          client1ContactDetails: { firstName, surName, phoneNumber,email, dateOfMAIM, location },
          connectionData: { companyID: req.user._id }
        })

        const companyId = req.user._id;

        // Update the company's cases array with the new case ID
        await Company.findByIdAndUpdate(companyId._id, { $push: { cases: newCase._id } });

        clientData.email = email;
        clientData.clientName = `${newCase[0].client1ContactDetails.firstName} ${newCase[0].client1ContactDetails.surName}`;
        messageBodyinfo.formUrl = `${config.baseUrl}/addClient1/${newCase[0]._id}`;
        companyData.companyName = req.user.companyName;
        companyData.email = req.user.email;
        sendMail(companyData, clientData, messageBodyinfo)

      res.json({ message: " company has added client " })
    }
    else if (req.userRole == 'mediator') {
      const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId')
      let newCase = await Case.insertMany(
        {
          client1ContactDetails: { firstName, surName, phoneNumber, dateOfMAIM, location },
          connectionData: { mediatorID: req.user._id, companyID: mediatorCompanyData.companyId._id }
        });

         // Update the company's cases array with the new case ID
        await Company.findByIdAndUpdate(mediatorCompanyData.companyId, { $push: { cases: newCase._id } });

      clientData.email = email;
        clientData.clientName = `${newCase[0].client1ContactDetails.firstName} ${newCase[0].client1ContactDetails.surName}`;
        messageBodyinfo.formUrl = `${""}/addClient1/${newCase[0]._id}`;

      companyData.companyName = mediatorCompanyData.companyId.companyName
      companyData.email = mediatorCompanyData.companyId.email
      sendMail(companyData, clientData, messageBodyinfo)

      res.json({ message: " mediator has added client " })
    }

    else {
      res.json({ 'message': "error in the role of token" })
    }
  } catch (err) {
    res.json({ message: "error with the end point" })
  }

});






router.get('/test', async (req, res) => {
  sendMail()
  const x = await mediator.find({ _id: '6454e93139652cb9b2f1de65' }).populate('companyId')
  console.log(x[0].companyId.companyName)

  res.json(x)
})

module.exports = router;
