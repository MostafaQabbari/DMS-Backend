const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");

const sendMailForMIAM2 = function ( mediatorData ,clientData, messageBodyinfo ) {

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

router.patch("/addClient1/:id", async (req, res) => {


    try {
        let currentCase = await Case.findById(req.params.id);
        let client1data = req.body
        let Reference = `${req.body.personalInfo.surName}& ${req.body.Client2Details.SurName}`;

        const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
     
        let mediatorData = {}, clientData = {}, messageBodyinfo = {};

        mediatorData.name =`${medData.connectionData.mediatorID.firstName} ${ medData.connectionData.mediatorID.lastName}`;

        // will replace this by medEmail
        const medEmail = medData.connectionData.mediatorID.email;
        mediatorData.email = "abdosamir023023@gmail.com"

        if (!currentCase.client1AddedData) {

            let updatedCase = await Case.findByIdAndUpdate(req.params.id, { client1data, Reference, client1AddedData: true })

            clientData.fname = updatedCase.client1data[0].personalInfo.firstName;
            clientData.surName = updatedCase.client1data[0].personalInfo.surName;

          
            messageBodyinfo.formUrl = `${config.baseUrl}/${config.MIAM_PART_2}/${updatedCase._id}`;
            
            console.log(updatedCase)
            sendMailForMIAM2(mediatorData,clientData,messageBodyinfo)
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