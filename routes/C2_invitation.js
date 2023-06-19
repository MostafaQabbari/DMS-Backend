const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");

const stream = require("stream");
const { google } = require("googleapis");
const { PDFDocument } = require("pdf-lib");
const drive = google.drive('v3');

const C2InviationMailApplied = function (mediatorData, clientData, messageBodyinfo) {

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
      <h3>MIAM 1 has been applied by ${clientData.fname} ${clientData.surName} and that's your link to apply your MIAM 2 </h3>
      <a href='${messageBodyinfo.formUrl}' style="color:white; padding:5px; font-size: larger; font-weight: bolder;border:solid 5px">Click here </a>
      <h4> MIAM 1 is attached as a pdf file </h4>

      <p> Best Regards </p>
      <p> DMS Team </p>
      
      </div>
      </body>`,

  });

}

router.patch("/C2_invitation/:id", async (req, res) => {


  try {

    let currentCase = await Case.findById(req.params.id);
    let C2invitation = req.body

    const StringfyData = JSON.stringify(C2invitation)

    const companyData = await Case.findById(req.params.id).populate('connectionData.companyID');
    const companyEmail = companyData.connectionData.companyID.email;

    const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
    const medEmail = medData.connectionData.mediatorID.email;
    
    mediatorData.name = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;
    mediatorData.email = medEmail


    // messageBodyinfo.formUrl = `${config.baseUrlMIAM2}/${config.MIAM_PART_2}/${updatedCase._id}`;

     res.json("parsedClientData")

  
  } catch (err) {
    res.json(err.message)
  }


})









module.exports = router;