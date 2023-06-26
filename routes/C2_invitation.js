const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const dateNow = require("../global/dateNow")


const sendMailC2_M1 = function (caseDetails, mediationDetails, messageInfo) {

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
         caseDetails.C2mail,
         caseDetails.C2name
         caseDetails.C1name

          mediationDetails.companyName
          mediationDetails.medName

         messageInfo.formUrl
  }
  */


  let info = transporter.sendMail({
    from: config.companyEmail,
    to: caseDetails.C2mail,
    subject: `Invitation to mediation by ${mediationDetails.companyName} `,
    html: `<body>
      <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
      <h1>Hello ${caseDetails.C2name}  </h1>
      <h3>Thanks for applying you invitation to mediation with your partner  ${caseDetails.C1name} and that's your link to apply your MIAM form </h3>
      <a href='${messageInfo.formUrl}' style="color:white; padding:5px; font-size: larger; font-weight: bolder;border:solid 5px">Click here </a>
 
      <p> Best Regards </p>
      <p>${mediationDetails.companyName}'s Team </p>
      <p> Mediator : ${mediationDetails.medName} Team </p>
      
      </div>
      </body>`,

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
  let caseDetails = {}, mediationDetails = {}, messageInfo = {};

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


      const companyData = await Case.findById(req.params.id).populate('connectionData.companyID');
      const companyEmail = companyData.connectionData.companyID.email;
      const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
      const medEmail = medData.connectionData.mediatorID.email;


      caseDetails.C2mail = MajorDataC2.mail
      caseDetails.C2name = `${MajorDataC2.fName} ${MajorDataC2.sName}`
      caseDetails.C1name = `${updatedCase.MajorDataC1.fName} ${updatedCase.MajorDataC1.sName}`

      mediationDetails.companyName = `${companyData.connectionData.companyID.companyName}`;
      mediationDetails.medName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;

      messageInfo.formUrl = `${config.baseUrlMIAM1}/${config.C2_M1}/${updatedCase._id}`;
      sendMailC2_M1(caseDetails, mediationDetails, messageInfo);

      let mediatorData={}, caseData={};
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