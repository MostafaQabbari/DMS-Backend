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
const sendSMS_M1C1 = function (twillioInfo, clientNumber, messageBodyData) {

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
const sendMail_M1C1 = function (companyData, clientData, messageBodyinfo) {

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

const sendMail_C2Invitation = function (caseDetails, mediationDetails, messageInfo) {

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
        <h3>This is an invitation to mediation with your partner  ${caseDetails.C1name} and that's your link to apply your invitation form </h3>
        <a href='${messageInfo.formUrl}' style="color:white; padding:5px; font-size: larger; font-weight: bolder;border:solid 5px">Click here </a>
   
        <p> Best Regards </p>
        <p>${mediationDetails.companyName}'s Team </p>
        <p> Mediator : ${mediationDetails.medName} Team </p>
        
        </div>
        </body>`,

    });

}
const sendSMS_C2Invitation = function (twillioInfo, clientNumber, messageBodyData) {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientNumber = {clientNumber}
      messageBodyData = {clientName ,companyName, formLink   }
    */
    const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
    const phoneNumber = twillioInfo.twillioNumber;

    const messageBody = `Hello ${messageBodyData.clientName}  ,
     Here is your link to apply to the mediation invitation ${messageBodyData.formLink} ,
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

const sendMail_C2_M1 = function (caseDetails, mediationDetails, messageInfo) {

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
        <h3>Thanks for applying you invitation to mediation with your partner ${caseDetails.C1name} and that's your link to apply your MIAM form </h3>
        <a href='${messageInfo.formUrl}' style="color:white; padding:5px; font-size: larger; font-weight: bolder;border:solid 5px">Click here </a>
   
        <p> Best Regards </p>
        <p>${mediationDetails.companyName}'s Team </p>
        <p> Mediator : ${mediationDetails.medName} Team </p>
        
        </div>
        </body>`,

    });

}
const sendSMS_C2_M1 = function (twillioInfo, clientNumber, messageBodyData) {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientNumber = {clientNumber}
      messageBodyData = {clientName ,companyName, formLink   }
    */
    const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
    const phoneNumber = twillioInfo.twillioNumber;

    const messageBody = `Hello ${messageBodyData.clientName}  ,
     Here is your link to apply to the MIAM form ${messageBodyData.formLink} ,
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

const validNumber = function (x) {

    if (!isNaN(Number(x))) {
        return true
    } else {
        return false
    }
}
const validationMail = function (x) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(x)) {
        return true
    } else {
        return false
    }
}




router.post('/sendM1_sms_C1/:id', authMiddleware, decryptTwillioData, async (req, res, next) => {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientNumber = {clientNumber}
      messageBodyData = {clientName ,companyName, formLink   }
    */

    let clientNumber;
    let messageBodyData = {};

    let twillioInfo = req.twillioInfo;
    console.log(twillioInfo)

    try {
        const  caseID  = req.params.id;
        const selectedCase = await Case.findById(caseID);
        const client1ContactDetails = selectedCase.MajorDataC1
        const compData = await Case.findById(caseID).populate('connectionData.companyID');

        //clientNumber = "+44 7476 544877"
        clientNumber = client1ContactDetails.phoneNumber;
        messageBodyData.companyName = compData.connectionData.companyID.companyName
        messageBodyData.clientName = `${client1ContactDetails.fName} ${client1ContactDetails.sName}`;
        messageBodyData.formLink = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/C1/${caseID}`;
        sendSMS_M1C1(twillioInfo, clientNumber, messageBodyData)

        res.status(200).json({ message: "MIAM 1 link has been sent " })

    } catch (err) {
        res.status(400).json({ message: "error with the end point" })
    }

});


router.post('/sendM1_mail_C1/:id', authMiddleware, async (req, res, next) => {

    let clientData = {};
    let companyData = {};
    let messageBodyinfo = {};

    try {
        const caseID = req.params.id;
        const selectedCase = await Case.findById(caseID);
        const client1ContactDetails = selectedCase.MajorDataC1
        const compData = await Case.findById(caseID).populate('connectionData.companyID');
        // console.log(client1ContactDetails)

        clientData.clientName = `${client1ContactDetails.fName} ${client1ContactDetails.sName}`;
        clientData.email = client1ContactDetails.mail
        // console.log(clientData.email)
        companyData.companyName = compData.connectionData.companyID.companyName
        companyData.email = compData.connectionData.companyID.email
        messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/C1/${caseID}`;

        sendMail_M1C1(companyData, clientData, messageBodyinfo)

        res.status(200).json({ message: "MIAM 1 link has been sent " })

    } catch (err) {
        res.status(400).json({ message: "error with the end point" })
    }

});


router.post("/sendM1_mail_C2/:id", authMiddleware, async (req, res) => {
    try {
        const caseID  = req.params.id;
        const currentCase = await Case.findById(caseID);
        let caseDetails = {}, mediationDetails = {}, messageInfo = {};
        caseDetails.C2name = `${currentCase.MajorDataC2.fName} ${currentCase.MajorDataC2.sName}`
        caseDetails.C1name = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`
        caseDetails.C2mail = currentCase.MajorDataC2.mail
        if (validationMail(caseDetails.C2mail)) {

            const compData = await Case.findById(caseID).populate('connectionData.companyID');
            mediationDetails.companyName = compData.connectionData.companyID.companyName
            const medData = await Case.findById(caseID).populate('connectionData.mediatorID');
            mediationDetails.medName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`
            messageInfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/C2/${caseID}`;
            sendMail_C2_M1(caseDetails, mediationDetails, messageInfo)

            res.status(200).json({ message: "C2_M1 link has been sent " })


        }
        else {
            res.status(400).json({ message: "please enter valid mail to send to ... " })
        }

    } catch (err) {
        res.status(400).json({ message: "error with the end point" })
    }



})
 
router.post('/sendM1_sms_C2/:id', authMiddleware, decryptTwillioData, async (req, res, next) => {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientNumber = {clientNumber}
      messageBodyData = {clientName ,companyName, formLink   }
    */

    let twillioInfo = req.twillioInfo;
    let clientNumber;
    let messageBodyData = {};
 //   console.log(twillioInfo)

    try {
        const caseID  = req.params.id;
        const selectedCase = await Case.findById(caseID);
        const MajorDataC2 = selectedCase.MajorDataC2

        if(validNumber(selectedCase.MajorDataC2.phoneNumber)){

            //! here will go on with the client number
            //clientNumber = "+44 7476 544877";
            
            clientNumber = selectedCase.MajorDataC2.phoneNumber;
            const compData = await Case.findById(caseID).populate('connectionData.companyID');
    
            messageBodyData.companyName = compData.connectionData.companyID.companyName
            messageBodyData.clientName = `${MajorDataC2.fName} ${MajorDataC2.sName}`;
            messageBodyData.formLink = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/C2/${caseID}`;
    
    
    
            sendSMS_C2_M1(twillioInfo, clientNumber, messageBodyData)
    
            res.status(200).json({ message: "C2_M1 has been sent and added phone number to the client2 data " })
        }else
        {
            res.status(400).json({ message: "Invalid Number to recieve the invitation by SMS" })
        }

    } catch (err) {
        res.status(400).json({ message: "error with the end point" })
    }

});




router.post("/MailC2Invitaion", authMiddleware, async (req, res) => {
    /*{
               caseDetails.C2mail,
               caseDetails.C2name
               caseDetails.C1name
    
                mediationDetails.companyName
                mediationDetails.medName
    
                messageInfo.formUrl
        }
        */
    try {
        const { caseID, C2mail } = req.body;
        if (validationMail(C2mail)) {
            const currentCase = await Case.findById(caseID);
            let caseDetails = {}, mediationDetails = {}, messageInfo = {};

            caseDetails.C2name = `${currentCase.MajorDataC2.fName} ${currentCase.MajorDataC2.sName}`
            caseDetails.C1name = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`
            caseDetails.C2mail = C2mail

            await Case.findByIdAndUpdate(caseID, {
                $set: {
                    'MajorDataC2.mail': C2mail
                }
            })
            const compData = await Case.findById(caseID).populate('connectionData.companyID');
            mediationDetails.companyName = compData.connectionData.companyID.companyName
            const medData = await Case.findById(caseID).populate('connectionData.mediatorID');
            mediationDetails.medName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`
            messageInfo.formUrl = `${config.baseUrlC2Invitation}/${config.C2_Invitaion}/${caseID}`;
            sendMail_C2Invitation(caseDetails, mediationDetails, messageInfo)

            res.status(200).json({ message: "C2 Invitation link has been sent " })


        }
        else {
            res.status(400).json({ message: "please enter valid mail to send to ... " })
        }

    } catch (err) {
        res.status(400).json({ message: "error with the end point" })
    }



})
router.post("/Resend_MailC2Invitaion/:id", authMiddleware, async (req, res) => {
    /*{
               caseDetails.C2mail,
               caseDetails.C2name
               caseDetails.C1name
    
                mediationDetails.companyName
                mediationDetails.medName
    
                messageInfo.formUrl
        }
        */
    try {
        const  caseID  = req.params.id;
        const currentCase = await Case.findById(caseID);
        let caseDetails = {}, mediationDetails = {}, messageInfo = {};
        caseDetails.C2name = `${currentCase.MajorDataC2.fName} ${currentCase.MajorDataC2.sName}`
        caseDetails.C1name = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`
        caseDetails.C2mail = currentCase.MajorDataC2.mail
        if (validationMail(caseDetails.C2mail)) {

            const compData = await Case.findById(caseID).populate('connectionData.companyID');
            mediationDetails.companyName = compData.connectionData.companyID.companyName
            const medData = await Case.findById(caseID).populate('connectionData.mediatorID');
            mediationDetails.medName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`
            messageInfo.formUrl = `${config.baseUrlC2Invitation}/${config.C2_Invitaion}/${caseID}`;
            sendMail_C2Invitation(caseDetails, mediationDetails, messageInfo)

            res.status(200).json({ message: "C2 Invitation link has been sent " })


        }
        else {
            res.status(400).json({ message: "please enter valid mail to send to ... " })
        }

    } catch (err) {
        res.status(400).json({ message: "error with the end point" })
    }



})

router.post('/SMSC2Invitation', authMiddleware, decryptTwillioData, async (req, res, next) => {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientNumber = {clientNumber}
      messageBodyData = {clientName ,companyName, formLink   }
    */

    let twillioInfo = req.twillioInfo;
    let clientNumber;
    let messageBodyData = {};
   // console.log(twillioInfo)

    try {
        const { caseID, C2phoneNumber } = req.body;
        const selectedCase = await Case.findById(caseID);
        const MajorDataC2 = selectedCase.MajorDataC2
        //! here will go on with the client number
         clientNumber = C2phoneNumber;
       // clientNumber = "+44 7476 544877";

        const compData = await Case.findById(caseID).populate('connectionData.companyID');

        messageBodyData.companyName = compData.connectionData.companyID.companyName
        messageBodyData.clientName = `${MajorDataC2.fName} ${MajorDataC2.sName}`;
        messageBodyData.formLink = `${config.baseUrlC2Invitation}/${config.C2_Invitaion}/${caseID}`;
        await Case.findByIdAndUpdate(caseID, {
            $set: {
                'MajorDataC2.phoneNumber': C2phoneNumber
            }
        })

        sendSMS_C2Invitation(twillioInfo, clientNumber, messageBodyData)

        res.status(200).json({ message: "C2 Invitation has been sent and added phone number to the client2 data " })

    } catch (err) {
        res.status(400).json({ message: "error with the end point" })
    }

});
router.post('/Resend_SMSC2Invitation/:id', authMiddleware, decryptTwillioData, async (req, res, next) => {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientNumber = {clientNumber}
      messageBodyData = {clientName ,companyName, formLink   }
    */

    let twillioInfo = req.twillioInfo;
    let clientNumber;
    let messageBodyData = {};
 //   console.log(twillioInfo)

    try {
        const  caseID  = req.params.id;
        const selectedCase = await Case.findById(caseID);
        const MajorDataC2 = selectedCase.MajorDataC2

        if(validNumber(selectedCase.MajorDataC2.phoneNumber)){

            //! here will go on with the client number
              clientNumber = selectedCase.MajorDataC2.phoneNumber;
           // clientNumber = "+44 7476 544877";
    
            const compData = await Case.findById(caseID).populate('connectionData.companyID');
    
            messageBodyData.companyName = compData.connectionData.companyID.companyName
            messageBodyData.clientName = `${MajorDataC2.fName} ${MajorDataC2.sName}`;
            messageBodyData.formLink = `${config.baseUrlC2Invitation}/${config.C2_Invitaion}/${caseID}`;
    
    
    
            sendSMS_C2Invitation(twillioInfo, clientNumber, messageBodyData)
    
            res.status(200).json({ message: "C2 Invitation has been sent and added phone number to the client2 data " })
        }else
        {
            res.status(400).json({ message: "Invalid Number to recieve the invitation by SMS" })
        }

    } catch (err) {
        res.status(400).json({ message: "error with the end point" })
    }

});





module.exports = router;