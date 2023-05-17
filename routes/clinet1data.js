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

const sendMailForMIAM2 = function (compData, clientData, messageBodyinfo) {

    /*
  
     compData ={companyName , email}
     clientData = {fname ,surName}
     messageBodyinfo = {formUrl}
  
    */

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: config.companyEmail,
            pass: config.appPassWord,
        },
    });


    let info = transporter.sendMail({

        to: compData.email,
        subject: `MIAM 1 has been applied by ${clientData.fname} ${clientData.surName}`,
        html: `<body>
      <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
      <h1>Hello ${compData.companyName} 's Teams  </h1>
      <h3>MIAM 1 has been applied by ${clientData.fname} ${clientData.surName} and that's your link to apply your MIAM 2 </h3>
      <a href='${messageBodyinfo.formUrl}' style="color:white; padding:5px; font-size: larger; font-weight: bolder;border:solid 5px">Click here </a>
      <h4> MIAM 1 is attached as a pdf file </h4>

      <p> Best Regards </p>
      <p> DMS Team </p>
      
      </div>
      </body>`,

    });

}

router.post("/addClient1/:id", async (req, res) => {


    try {
        let currentCase = await Case.findById(req.params.id);
        let client1data = req.body
        let Reference = `${req.body.personalInfo.surName}& ${req.body.Client2Details.SurName}`;

        const CompanyData = await Case.findById(req.params.id).populate('connectionData.companyID');
        const companyEmail = CompanyData.connectionData.companyID.email;
        let compData = {}, clientData = {}, messageBodyinfo = {};
        compData.companyName = CompanyData.connectionData.companyID.companyName;
        // will replace this by companyEmail
        compData.email = "abdo.samir.7719@gmail.com"

        if (!currentCase.client1AddedData) {

            let updatedCase = await Case.findByIdAndUpdate(req.params.id, { client1data, Reference, client1AddedData: true })

            clientData.fname = updatedCase.client1data[0].personalInfo.firstName;
            clientData.surName = updatedCase.client1data[0].personalInfo.surName;

            console.log(updatedCase)
            messageBodyinfo.formUrl = `${config.baseUrl}/MIAM2/${updatedCase._id}`;

            sendMailForMIAM2(compData,clientData,messageBodyinfo)
            res.json(updatedCase)

        }
        else {
            res.json({ "message": "this from has been applied before" })

        }
    } catch (err) {
        res.json({ "message": "error with adding client1 data" })
    }


})




module.exports = router;