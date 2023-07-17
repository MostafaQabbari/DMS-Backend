const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const dateNow = require("../global/dateNow");


const sendMailForMIAM2 = function (mediatorData, clientData, messageBodyinfo) {

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
    to: mediatorData.email,
    subject: `MIAM 1 has been applied by ${clientData.fname} ${clientData.surName}`,
    html: `<body>
      <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
      <h1>Hello ${mediatorData.name} 's Teams  </h1>
      <h3>MIAM 1 has been applied by C2 ${clientData.fname} ${clientData.surName} and that's your link to apply your MIAM 2 </h3>
      <a href='${messageBodyinfo.formUrl}' style="color:white; padding:5px; font-size: larger; font-weight: bolder;border:solid 5px">Click here </a>
      <h4> MIAM 1_C2 is attached as a pdf file </h4>

      <p> Best Regards </p>
      <p> DMS Team </p>
      
      </div>
      </body>`,

  });

}

router.patch("/addC2MIAM1/:id", async (req, res) => {


  try {
    let currentCase = await Case.findById(req.params.id);
    console.log(currentCase)
    
    let client2data = req.body
    let Reference = `${req.body.otherParty.otherPartySurname} & ${req.body.personalContactAndCaseInfo.surName}`;
    let MajorDataC2 = {
      fName: req.body.personalContactAndCaseInfo.firstName,
      sName: req.body.personalContactAndCaseInfo.surName,
      mail: req.body.personalContactAndCaseInfo.email,
      phoneNumber: req.body.personalContactAndCaseInfo.phoneNumber
    }
    let availableTimes_C2={
      whatDaysCanNotAttend:req.body.personalContactAndCaseInfo.whatDaysCanNotAttend,
      appointmentTime:req.body.personalContactAndCaseInfo.appointmentTime,
    }


    const StringfyData = JSON.stringify(client2data)


     // const companyData = await Case.findById(req.params.id).populate('connectionData.companyID');
    // const companyEmail = companyData.connectionData.companyID.email;

    const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');

    let mediatorData = {}, clientData = {}, messageBodyinfo = {};
    mediatorData.name = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;

    // will replace this by medEmail
    const medEmail = medData.connectionData.mediatorID.email;
    mediatorData.email = medEmail

    //!currentCase.client2AddedData
    if (true) {


      let statusRemider = {
        reminderID: `${currentCase._id}-statusRemider`,
        reminderTitle: `${currentCase.Reference}-MIAM Part 1-C2`,
        startDate: dateNow()
      }
  
      await Case.findByIdAndUpdate(req.params.id, {
        client2data: StringfyData, $set: {
          'Reminders.statusRemider': statusRemider
        }, Reference, client2AddedData: true, MajorDataC2,availableTimes_C2,status: "MIAM Part 1-C2"
      })
      const updatedCase = await Case.findById(req.params.id);

      const parsedClientData = JSON.parse(updatedCase.client2data)

      clientData.fname = parsedClientData.personalContactAndCaseInfo.firstName;
      clientData.surName = parsedClientData.personalContactAndCaseInfo.surName;
      messageBodyinfo.formUrl = `${config.baseUrlMIAM2}/${config.MIAM_PART_2}/${updatedCase._id}`;

      sendMailForMIAM2(mediatorData, clientData, messageBodyinfo)

      res.json({ "message": "M1_C2 has been added " })

    }
    else {
      res.json({ "message": "this from has been applied before" })

    }
  } catch (err) {
    res.json(err.message)
  }


})








module.exports = router;