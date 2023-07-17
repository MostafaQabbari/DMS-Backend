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



const sendMailMIAM1 = function (companyData, clientData, messageBodyinfo) {

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
    <p> Thanks for booking you MIAM . BEFORE your Mediation information & Assessment Meeting (MIAM) with one of our family mediators ,
     we need you to complete an online form records basic information about you and your situation. </p>
     <p> Please click on the link below :</p>
    <a href='${messageBodyinfo.formUrl}'  style="color:white; padding:5px;"> ${messageBodyinfo.formUrl} </a>
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
const sendMailPassporting = function (companyData, clientData, messageBodyinfo) {

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
    <p> Thanks for booking you MIAM booking you MIAM  , here is your passporting form </p>
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
const sendMailLowIncome = function (companyData, clientData, messageBodyinfo) {

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
    <p> Thanks for booking you MIAM , here is your low income / no income form </p>
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



router.post('/creatCase', authMiddleware, async (req, res, next) => {

  let companyData = {};
  let clientData = {};
  let messageBodyinfo = {};
  

  try {
    if (req.userRole == 'company') {
      const { firstName, surName, phoneNumber, email, dateOfMAIM, location, mediatorMail , caseType } = req.body;
      let MIAM_C1_Date = dateOfMAIM
      const Themediator = await mediator.findOne({ email: mediatorMail });
      const companyId = req.user._id;

      let Reference = `${surName} `;
      let newCaseID;
      if (Themediator) {

 
        let newCase = await Case.insertMany(
          {
            client1ContactDetails: { firstName, surName, phoneNumber, email, dateOfMAIM, location ,caseType },
            startDate: dateOfMAIM,
            status: `New Case`,
            Reference,
            MajorDataC1: {
              fName: firstName,
              sName: surName,
              mail: email,
              phoneNumber: phoneNumber
            },
            $set: {

              'MIAMDates.MIAM_C1_Date': MIAM_C1_Date,

            },

            connectionData: { companyID: req.user._id, mediatorID: Themediator._id }
          });

        let statusRemider = {
          reminderID: `${newCase[0]._id}-statusRemider`,
          reminderTitle: `${Reference}-${newCase[0].status}`,
          startDate: dateNow()
        }

      
        await Case.findByIdAndUpdate(newCase[0]._id, {
          $set: {
            'Reminders.statusRemider': statusRemider
          }
        });


        newCaseID = newCase[0]._id
        // Update the company's cases array with the new case ID
        await Company.findByIdAndUpdate(companyId, { $push: { cases: newCase[0]._id } });
        await mediator.findByIdAndUpdate(Themediator._id, { $push: { cases: newCase[0]._id } });

        clientData.email = email;
        clientData.clientName = `${newCase[0].client1ContactDetails.firstName} ${newCase[0].client1ContactDetails.surName}`;
        companyData.companyName = req.user.companyName;
        companyData.email = req.user.email;
 
        if(req.body.caseType=='private')
        {
          messageBodyinfo.formType= "MIAM 1"
          messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1_client1}/${newCase[0]._id}`;
          sendMailMIAM1(companyData, clientData, messageBodyinfo)

        }
        else if(req.body.caseType=='lowIncome'){
          messageBodyinfo.formType="low Income / No Income"
          messageBodyinfo.formUrl = `${config.baseUrllowIncomeForm}/${config.LOWINCOME_NOINCOME_client1}/${newCase[0]._id}`;
          sendMailLowIncome(companyData, clientData, messageBodyinfo)
        }
        else if(req.body.caseType=='passporting'){
          messageBodyinfo.formType= 'Passporting'
          messageBodyinfo.formUrl = `${config.baseUrlpassportingForm}/${config.PASSPORTING_client1}/${newCase[0]._id}`;
          sendMailPassporting(companyData, clientData, messageBodyinfo)
        }
        else
        {
          res.json({ "message": "please confirm case type" })
        }

      }
      else {
        res.json({ "message": "please add the mediator first" })
      }

      res.json({ caseID: newCaseID })
    }

//     else if (req.userRole == 'mediator') {
//       const { firstName, surName, phoneNumber, email, dateOfMAIM, location } = req.body;
//       let MIAM_C1_Date = dateOfMAIM;
// console.log(MIAM_C1_Date)

//       const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');
//       let Reference = `${surName} `;

//       let newCase = await Case.insertMany(
//         {
//           client1ContactDetails: { firstName, surName, phoneNumber, email, dateOfMAIM, location },
//           startDate: dateOfMAIM,
//           status: "MIAM 1 sent to C1",
//           Reference,
//           MajorDataC1: {
//             fName: firstName,
//             sName: surName,
//             mail: email,
//             phoneNumber: phoneNumber
//           },
//           MIAMDates:{
//             MIAM_C1_Date: MIAM_C1_Date
//           },
    
//           connectionData: { mediatorID: req.user._id, companyID: mediatorCompanyData.companyId._id }
//         });
 
//       let statusRemider = {
//         reminderID: `${newCase[0]._id}-statusRemider`,
//         reminderTitle: `${Reference}-${newCase[0].status}`,
//         startDate: dateNow()
//       }
     

//       await Case.findByIdAndUpdate(newCase[0]._id, {
//         $set: {
//           'Reminders.statusRemider': statusRemider
//         }
//       });
//       // Update the company's cases array with the new case ID
//       const compID = mediatorCompanyData.companyId._id;
//       const medID = req.user._id
//       await Company.findByIdAndUpdate(compID, { $push: { cases: newCase[0]._id } });
//       await mediator.findByIdAndUpdate(medID, { $push: { cases: newCase[0]._id } });

//       clientData.email = email;
//       clientData.clientName = `${newCase[0].client1ContactDetails.firstName} ${newCase[0].client1ContactDetails.surName}`;
//       messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1_client1}/${newCase[0]._id}`;

//       companyData.companyName = mediatorCompanyData.companyId.companyName
//       companyData.email = mediatorCompanyData.companyId.email
//       sendMail(companyData, clientData, messageBodyinfo)
//       res.json({ caseID: newCase[0]._id })
//     }

    else {
      res.json({ 'message': "error in the role of token" })
    }
  } catch (err) {
    res.json({ message: err.message })
  }

});










router.get('/getCasesList', authMiddleware, async (req, res) => {

  let client1data, Reference, startDate, tempRefDummyData, MIAM2mediator
  let resposedCaseObj, casesList = [];
  let tempDate

  try {
    if (req.userRole == "company") {

      let cases = await Company.findById(req.user._id).populate('cases');
      for (let i = 0; i < cases.cases.length; i++) {

        resposedCaseObj = {
          _id: cases.cases[i]._id,
          Reference: cases.cases[i].Reference,
          status: cases.cases[i].status,
          startDate: cases.cases[i].startDate,
        }

        casesList.push(resposedCaseObj)

      }


      res.json(casesList)

    }
    else if (req.userRole == "mediator") {


      let cases = await mediator.findById(req.user._id).populate('cases');

      for (let i = 0; i < cases.cases.length; i++) {

        resposedCaseObj = {
          _id: cases.cases[i]._id,
          Reference: cases.cases[i].Reference,
          status: cases.cases[i].status,
          startDate: cases.cases[i].startDate,
        }

        casesList.push(resposedCaseObj)

      }


      res.json(casesList)

    }
    else {
      res.json("error with auth role ")
    }
  } catch (err) {
    res.json(err.message)
  }


})




router.get('/getCasesDetails/:id', authMiddleware, async (req, res) => {

  let CaseFound, CaseResponse, MIAM1_C1, MIAM1_C2, MIAM2_C1, MIAM2_C2, MajorDataC1, MajorDataC2, C2invitation;
  let Reminders, MIAMDates;
  //let Reference , client1ContactDetails , client1data , MIAM2mediator , client2data , MIAM2C2;



  try {

    if (req.userRole == "company") {

      let cases = await Company.findById(req.user._id).populate('cases');

      for (let i = 0; i < cases.cases.length; i++) {
        if (cases.cases[i]._id == req.params.id) {

          CaseFound = (cases.cases[i])
        }
      }
      if (CaseFound) {
        if (CaseFound.client1data) MIAM1_C1 = JSON.parse(CaseFound.client1data); else MIAM1_C1 = "Data didn't added yet"
        if (CaseFound.MIAM2mediator) MIAM2_C1 = JSON.parse(CaseFound.MIAM2mediator); else MIAM2_C1 = "Data didn't added yet"
        if (CaseFound.client2data) MIAM1_C2 = JSON.parse(CaseFound.client2data); else MIAM1_C2 = "Data didn't added yet"
        if (CaseFound.MIAM2C2) MIAM2_C2 = JSON.parse(CaseFound.MIAM2C2); else MIAM2_C2 = "Data didn't added yet";
        if (CaseFound.C2invitation) C2invitation = JSON.parse(CaseFound.C2invitation); else C2invitation = "Data didn't added yet";
        CaseFound.MIAMDates ? MIAMDates = CaseFound.MIAMDates : MIAMDates = "MIAM Dates didn't added yet"

        Reminders = CaseFound.Reminders
        MajorDataC1 = CaseFound.MajorDataC1;
        JSON.stringify(CaseFound.MajorDataC2) === '{}' ? MajorDataC2 = "C2 Data didn't added yet" : MajorDataC2 = CaseFound.MajorDataC2


        CaseResponse = {
          Reference: CaseFound.Reference,
          client1ContactDetails: CaseFound.client1ContactDetails,
          startDate: CaseFound.startDate,
          status: CaseFound.status,
          closed: CaseFound.closed,
          MIAM1_C1,
          MIAM2_C1,
          MIAM1_C2,
          MIAM2_C2,
          MajorDataC1,
          MajorDataC2,
          C2invitation,
          Reminders,
          MIAMDates

        }

        res.json(CaseResponse)
      }
      else {
        res.json(" you don't have the access on this case ")
      }

    }
    else if (req.userRole == "mediator") {

      let cases = await mediator.findById(req.user._id).populate('cases');

      for (let i = 0; i < cases.cases.length; i++) {
        if (cases.cases[i]._id == req.params.id) {

          CaseFound = (cases.cases[i])
        }
      }
      if (CaseFound) {
        if (CaseFound.client1data) MIAM1_C1 = JSON.parse(CaseFound.client1data); else MIAM1_C1 = "Data didn't added yet"
        if (CaseFound.MIAM2mediator) MIAM2_C1 = JSON.parse(CaseFound.MIAM2mediator); else MIAM2_C1 = "Data didn't added yet"
        if (CaseFound.client2data) MIAM1_C2 = JSON.parse(CaseFound.client2data); else MIAM1_C2 = "Data didn't added yet"
        if (CaseFound.MIAM2C2) MIAM2_C2 = JSON.parse(CaseFound.MIAM2C2); else MIAM2_C2 = "Data didn't added yet"
        if (CaseFound.C2invitation) C2invitation = JSON.parse(CaseFound.C2invitation); else C2invitation = "Data didn't added yet";
        CaseFound.MIAMDates ? MIAMDates = CaseFound.MIAMDates : MIAMDates = "MIAM Dates didn't added yet"
        console.log(CaseFound.MIAMDates)
        Reminders = CaseFound.Reminders
        MajorDataC1 = CaseFound.MajorDataC1;
        console.log(CaseFound.Reminders)

        JSON.stringify(CaseFound.MajorDataC2) === '{}' ? MajorDataC2 = "C2 Data didn't added yet" : MajorDataC2 = CaseFound.MajorDataC2


        CaseResponse = {
          Reference: CaseFound.Reference,
          client1ContactDetails: CaseFound.client1ContactDetails,
          startDate: CaseFound.startDate,
          status: CaseFound.status,
          closed: CaseFound.closed,
          MIAM1_C1,
          MIAM2_C1,
          MIAM1_C2,
          MIAM2_C2,
          MajorDataC1,
          MajorDataC2,
          C2invitation,
          Reminders,
          MIAMDates
        }

        res.json(CaseResponse)
      }
      else {
        res.json(" you don't have the access on this case ")
      }
    }
    else {
      res.json("err with user Auth")
    }

  } catch (err) {
    res.json(err.message)
  }


})


module.exports = router;


