const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const dateNow = require("../global/dateNow")


const sendMailMIAM1 = function (companyData, clientData, messageBodyinfo) {

  /*

   companyData ={companyName , email}
   clientData = {clientName ,email}
   messageBodyinfo = {formUrl ,caseType}

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

const confirmationAppliedMail = function (companyData, clientData) {

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
    subject: `Mediation process`,
    html: ` <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
     <h1>Dear ${clientData.clientName}  </h1>
    <p> Thanks for booking you invitation form , but still we need to get more details about your funding process , 
    please make sure to follow the redirect link </p>
    
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

const notifyMediator = function (mediatorData, caseData) {

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
    mediatorData.medName  
     mediatorData.MedMail
    mediationDetails.caseReference

         
  }
  */


  let info = transporter.sendMail({
    from: config.companyEmail,
    to: mediatorData.MedMail,
    subject: `C2 Invitation applied for  ${caseData.caseReference} `,
    html: `<body>
      <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
      <h1>Hello ${mediatorData.medName}  </h1>
      <h3>We love to inform you that C2_Invitation of ${caseData.caseReference} case have been applied</h3>
      <p> Best Regards </p>
      <p>DMS's Team </p> 
      </div>
      </body>`,

  });

}






router.patch("/C2_invitation/:id", async (req, res) => {
  let companyData = {}, clientData = {}, messageBodyinfo = {};

  try {

    let currentCase = await Case.findById(req.params.id);
    let C2invitation = req.body;
    let statusRemider = {
      reminderID: `${currentCase._id}-statusRemider`,
      reminderTitle: `${currentCase.Reference}-Invitation to C2 sent`,
      startDate: dateNow()
    }

    //currentCase.status == "MIAM Part 2-C2" && !currentCase.C2invitationApplied
    if (true) {

      let MajorDataC2 = {
        fName: C2invitation.firstName,
        sName: C2invitation.surName,
        mail: C2invitation.C2mail,
        phoneNumber: C2invitation.phoneNumber
      }
      let Reference = `${currentCase.MajorDataC1.sName}& ${C2invitation.surName}`;

      const StringfyData = JSON.stringify(C2invitation)

      const updatedCase = await Case.findByIdAndUpdate(req.params.id, {
        $set: {
          'MajorDataC2.fName': MajorDataC2.fName,
          'MajorDataC2.sName': MajorDataC2.sName,
          'MajorDataC2.mail': MajorDataC2.mail,
          'MajorDataC2.phoneNumber': MajorDataC2.phoneNumber,
          'Reminders.statusRemider': statusRemider
        }, C2invitation: StringfyData, C2invitationApplied: true, Reference, status: "Invitation to C2 sent"
      })


      const currentComp = await Case.findById(req.params.id).populate('connectionData.companyID');
      const companyEmail = currentComp.connectionData.companyID.email;
      const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
      const medEmail = medData.connectionData.mediatorID.email;

      clientData.email = MajorDataC2.mail
      clientData.clientName = `${MajorDataC2.fName} ${MajorDataC2.sName}`
      companyData.companyName = `${currentComp.connectionData.companyID.companyName}`;
      companyData.email = companyEmail

      // caseDetails.C1name = `${updatedCase.MajorDataC1.fName} ${updatedCase.MajorDataC1.sName}`
      // mediationDetails.medName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;


      if (req.body.privateOrLegailAid == "Private") {

        messageBodyinfo.formType = "MIAM 1"
        messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/${updatedCase._id}`;
        sendMailMIAM1(companyData, clientData, messageBodyinfo);
      }

      else if (
        req.body.privateOrLegailAid == "Legal Aid" &&
        req.body.makeMediationLegalaidForTheFamilly == "Yes" &&
        req.body.specificBenefits == "No" &&
        req.body.ConfirmationLegalAidIfEntitled == "No"
      ) {

        messageBodyinfo.formType = "low Income / No Income"
        messageBodyinfo.formUrl = `${config.baseUrllowIncomeForm}/${config.LOWINCOME_NOINCOME}/${updatedCase._id}`;
        sendMailLowIncome(companyData, clientData, messageBodyinfo);
      }
      else if (
        req.body.privateOrLegailAid == "Legal Aid" &&
        req.body.makeMediationLegalaidForTheFamilly == "Yes" &&
        req.body.specificBenefits == "Yes"
      ) {

        messageBodyinfo.formType = "Passporting"
        messageBodyinfo.formUrl = `${config.baseUrlpassportingForm}/${config.PASSPORTING}/${updatedCase._id}`;
        sendMailPassporting(companyData, clientData, messageBodyinfo);
      }
      else if (
        req.body.privateOrLegailAid == "Legal Aid" &&
        req.body.makeMediationLegalaidForTheFamilly == "Yes" &&
        req.body.specificBenefits == "No" &&
        req.body.entitledToLegalAid=="No" &&
        req.body.ConfirmationLegalAidIfEntitled == "No"
      ) {

  
        confirmationAppliedMail(companyData, clientData);
     
      }
      else {
        res.json({ "message": "something missed about case type" })
      }



      let mediatorData = {}, caseData = {};
      mediatorData.medName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`
      mediatorData.MedMail = medEmail
      caseData.caseReference = updatedCase.Reference
      notifyMediator(mediatorData, caseData)




      res.json({ "res": "C2 invitation form has been applies" })
    }
    else {
      res.json({ "res": "this case has been applied before or not suitable please check it out" })
    }









  } catch (err) {
    res.json(err.message)
  }


})













module.exports = router;