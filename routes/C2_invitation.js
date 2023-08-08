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


const notifyCompanytoCall_C2Refused = function (companyData, clientData) {

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

      companyData ={companyName , email}
      caseData.caseReference
      caseData.C2callTimes

         
  }
  */
  let timesList = '';
  if (clientData.C2callTimes) {
    for (const date of clientData.C2callTimes) {
      timesList += `<li>${date}</li>`;
    }
  }


  let info = transporter.sendMail({
    from: config.companyEmail,
    to: companyData.email,
    subject: `C2 Invitation applied for  ${clientData.caseReference} `,
    html: `<body>
      <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
      <h1>Hello ${companyData.companyName}  </h1>
      <h3>We love to inform you that C2_Invitation of ${clientData.caseReference} case have been applied but he did not accept the invitation</h3>
      <h5>you can call him/her in these times</h5>
      <ul>${timesList}</ul>
      <p> Best Regards </p>
      <p>DMS's Team </p> 
      </div>
      </body>`,

  });

}

const notifyCompanytoCall_C2Confused = function (companyData, clientData) {

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

      companyData ={companyName , email}
      caseData.caseReference
      caseData.C2callTimes

         
  }
  */
  let timesList = '';

  if(caseData.C2callTimes)
  {

    for (const date of caseData.C2callTimes) {
      timesList += `<li>${date}</li>`;
    }
  }

  let info = transporter.sendMail({
    from: config.companyEmail,
    to: companyData.email,
    subject: `C2 Invitation applied for  ${clientData.caseReference} `,
    html: `<body>
      <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
      <h1>Hello ${companyData.companyName}  </h1>
      <h3>We love to inform you that C2_Invitation of ${clientData.caseReference} case have been applied but he confused about the case type </h3>
      <h5>you can call him/her in these times to follow up</h5>
      <ul>${timesList}</ul>
      <p> Best Regards </p>
      <p>DMS's Team </p> 
      </div>
      </body>`,

  });

}






router.patch("/C2_invitation/:id", async (req, res) => {
  let companyData = {}, clientData = {}, messageBodyinfo = {};

  try {

    let phoneCallAppointment_C2_C2reply;
    let currentCase = await Case.findById(req.params.id);
    let C2invitation = req.body;
    phoneCallAppointment_C2_C2reply = req.body.phoneCallAppointment

    let statusRemider = {
      reminderID: `${currentCase._id}-statusRemider`,
      reminderTitle: `${currentCase.Reference}-Invitation to C2 sent`,
      startDate: dateNow()
    }

    //currentCase.status == "MIAM Part 2-C2" && !currentCase.C2invitationApplied

    //!currentCase.C2invitationApplied
    if (true) {

      let MajorDataC2 = {
        fName: C2invitation.InvitationAnswer.firstName,
        sName: C2invitation.InvitationAnswer.surname,
        mail: C2invitation.InvitationAnswer.email,
        //phoneNumber: C2invitation.InvitationAccepted.phone
      }
      let Reference = `${currentCase.MajorDataC1.sName}& ${C2invitation.InvitationAnswer.surname}`;

      const StringfyData = JSON.stringify(C2invitation)

      const updatedCase = await Case.findByIdAndUpdate(req.params.id, {
        $set: {
          'MajorDataC2.fName': MajorDataC2.fName,
          'MajorDataC2.sName': MajorDataC2.sName,
          'MajorDataC2.mail': MajorDataC2.mail,
          'MajorDataC2.phoneNumber': MajorDataC2.phoneNumber,
          'Reminders.statusRemider': statusRemider
        }, C2invitation: StringfyData, C2invitationApplied: true, Reference, phoneCallAppointment_C2_C2reply, status: "Invitation to C2 sent"
      })


      const currentComp = await Case.findById(req.params.id).populate('connectionData.companyID');
      const companyEmail = currentComp.connectionData.companyID.email;

      companyData.companyName = `${currentComp.connectionData.companyID.companyName}`;
      companyData.email = companyEmail

      clientData.email = MajorDataC2.mail
      clientData.clientName = `${MajorDataC2.fName} ${MajorDataC2.sName}`;

      clientData.caseReference = Reference;
      clientData.C2callTimes = phoneCallAppointment_C2_C2reply

      // const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
      // const medEmail = medData.connectionData.mediatorID.email;
      // caseDetails.C1name = `${updatedCase.MajorDataC1.fName} ${updatedCase.MajorDataC1.sName}`
      // mediationDetails.medName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;

      if (req.body.InvitationAnswer.willingToComeToMediation == "No") {
        notifyCompanytoCall_C2Refused(companyData, clientData);



      }
      else if (req.body.InvitationAccepted.privateOrLegailAid == "Private" || req.body.InvitationAccepted.isStillLikeToMakeAnApplicationForLegalAid === "No") {

        await Case.findByIdAndUpdate(req.params.id, {
          caseTypeC2: "Private"
        })
        messageBodyinfo.formType = "MIAM 1"
        messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/C2/${updatedCase._id}`;
        sendMailMIAM1(companyData, clientData, messageBodyinfo);
      }

      else if (
        req.body.InvitationAccepted.privateOrLegal == "Legal Aid" &&
        req.body.InvitationAccepted.willingToMakeLegalAidApplication == "Yes" &&
        req.body.InvitationAccepted.isReceiptOfAnyOfTheseSpecificBenefits == "No" &&
        req.body.InvitationAccepted.isEntitledToLegalAid == "Yes"
      ) {
        await Case.findByIdAndUpdate(req.params.id, {
          caseTypeC2: "Legal Aid - low Income / No Income"
        })
        // messageBodyinfo.formType = "low Income / No Income"
        // messageBodyinfo.formUrl = `${config.baseUrllowIncomeForm}/${config.LOWINCOME_NOINCOME}/C2/${updatedCase._id}`;
        // sendMailLowIncome(companyData, clientData, messageBodyinfo);
      }
      else if (
        req.body.InvitationAccepted.privateOrLegal == "Legal Aid" &&
        req.body.InvitationAccepted.willingToMakeLegalAidApplication == "Yes" &&
        req.body.InvitationAccepted.isReceiptOfAnyOfTheseSpecificBenefits == "Yes"
      ) {

        await Case.findByIdAndUpdate(req.params.id, {
          caseTypeC2: "Legal Aid - Passporting"
        })
        // messageBodyinfo.formType = "Passporting"
        // messageBodyinfo.formUrl = `${config.baseUrlpassportingForm}/${config.PASSPORTING}/C2/${updatedCase._id}`;
        // sendMailPassporting(companyData, clientData, messageBodyinfo);
      }
      else if (
        req.body.InvitationAccepted.privateOrLegal == "Legal Aid" &&
        req.body.InvitationAccepted.willingToMakeLegalAidApplication == "Yes" &&
        req.body.InvitationAccepted.isReceiptOfAnyOfTheseSpecificBenefits == "No" &&
        req.body.InvitationAccepted.isEntitledToLegalAid == "Yes" &&
        req.body.InvitationAccepted.isStillLikeToMakeAnApplicationForLegalAid == "Yes"
      ) {


        notifyCompanytoCall_C2Confused(companyData, clientData)

      }
      // else {
      //   res.status(400).json({ "message": "something missed about case type" })
      // }

      res.status(200).json({ "res": "C2 invitation form has been applies" })
    }
    else {
      res.status(400).json({ "res": "this case has been applied before or not suitable please check it out" })
    }









  } catch (err) {
    res.status(400).json(err.message)
  }


})













module.exports = router;