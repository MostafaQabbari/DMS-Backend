const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");
const nodemailer = require("nodemailer")
const decryptTwillioData = require('../middleware/getDataFromTwilio');
const config = require("../config/config");
const CryptoJS = require("crypto-js");

const sendMIAM1LinklegalAid = function (companyData, clientData, messageBodyinfo) {
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

    transporter.sendMail({
        from: config.companyEmail,
        to: clientData.email,
        subject: "MIAM I Form",
        html: ` <div style="text-align: left; ">
       <h1>Dear ${clientData.clientName}  </h1>
      <h2>Thank you for the signed Legal Aid form. Your application for Legal Aid was SUCCESSFUL.
      BEFORE booking you for your Mediation Information & Assessment Meeting (MIAM) with one of our family mediators, we need you to complete an online form that records basic information about you and your situation. </h2>
      <h2> AFTER you have filled and SUBMITTED this form, a member of our team will get back to you to book your appointment. Please click on the link below: </h2>
      <a href='${messageBodyinfo.formUrl}'  style="font-weight: bolder;">${messageBodyinfo.formUrl} </a>
      <h2>PLEASE REMEMBER THAT WHEN YOU BOOK YOUR APPOINTMENT, IF YOU MISS IT, WE WILL NOT BE ABLE TO BOOK YOU ANOTHER.   </h2>
      <h3>Direct Mediation Services.</h3>
      <h3>${companyData.companyName}</h3>
      <h3>${companyData.email}</h3>
       </div>`,

    });


    // transporter.sendMail(info, (error, info) => {
    //     if (error) {
    //         console.log('Error occurred while sending email:', error.message);

    //     } else {
    //         console.log('Email sent successfully:', info.messageId);
    //     }
    // });

}

const sendSMSwithChangedBody = function (twillioInfo, clientNumber, messageBodyData, res) {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientNumber = {clientNumber}
      messageBodyData = bodyText
    */
    const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
    const phoneNumber = twillioInfo.twillioNumber;


    x.messages.create({
        body: messageBodyData,
        from: phoneNumber,
        to: clientNumber
    }).then(message => {
        console.log({ message: "form message sent succesfully", messageID: message.sid });
    }
    ).catch((err) => {
        console.log(err.message)
        res.status(400).json({ message: err.message })
    });

}
function handleTwillioData(targetComp) {

    const targetCompTwilioData = targetComp.twillioData;
    const data = CryptoJS.AES.decrypt(targetCompTwilioData, 'ourTwillioEncyptionKey');
    const decryptedTwillioData = JSON.parse(data.toString(CryptoJS.enc.Utf8))
    // return = > twillioInfo object by => targetCompany
    return decryptedTwillioData[0]

}
/*
"twillioData":{
        "twillioSID": "ACb1a7cb22177625214bc3a86ee3bfbfd6",
        "twillioToken": "e7380ebe9db5a0dff0590b5e2681386b",
        "twillioNumber": "+13252252480"
    }
*/
// status:"Application received / Approved / Further evidence required / Refused / Closes",

router.post('/changeLegalAidStatus/:clientType/:id', authMiddleware, async (req, res, next) => {

    let CaseFound;
    try {
        const legalAidStatus = req.body.legalAidStatus;
        const TargetClient = req.params.clientType; // C1 | C2
        let companyData = {}, clientData = {}, messageBodyinfo = {}
        if (legalAidStatus == 'Approved') {

            if (req.userRole == 'company') {
                let cases = await Company.findById(req.user._id).populate('cases');
                for (let i = 0; i < cases.cases.length; i++) {
                    if (cases.cases[i]._id == req.params.id) {
                        CaseFound = (cases.cases[i])
                    }
                }
                if (CaseFound) {
                    const currentComp = await Company.findById(req.user._id)
                    if (TargetClient == "C1") {
                        clientData.email = CaseFound.MajorDataC1.mail;
                        // clientData.email = 'abdo.samir.7719@gmail.com'
                        clientData.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                        companyData.companyName = currentComp.companyName
                        companyData.email = currentComp.email
                        messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/C1/${CaseFound._id}`;

                        let legalAidTableDataC1 = JSON.parse(CaseFound.legalAidTableData.C1);
                        legalAidTableDataC1.status = 'Approved';

                      //  console.log(legalAidTableDataC1)
                        await Case.findByIdAndUpdate(req.params.id, {
                            legalAidTableData: {
                                C1: JSON.stringify(legalAidTableDataC1)
                            },
                        })



                        sendMIAM1LinklegalAid(companyData, clientData, messageBodyinfo);
                        let twillioInfo = handleTwillioData(currentComp);
                        let clientNumber = CaseFound.MajorDataC1.phoneNumber
                        let messageBodyData = `Dear ${clientData.clientName},
                        An email with MIAM1 link was sent to you. You may need to check your SPAM folder.
                        Thank you.
                        ${companyData.companyName}
                        `
                        sendSMSwithChangedBody(twillioInfo, clientNumber, messageBodyData, res)

                        res.status(200).json({ res: "MIAM 1 Link has been sent ..." })
                    }
                    else if (TargetClient == "C2") {
                        clientData.email = CaseFound.MajorDataC2.mail;
                        clientData.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                        companyData.companyName = currentComp.companyName
                        companyData.email = currentComp.email
                        messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/C2/${CaseFound._id}`;
                     //   console.log(clientData)
                        let legalAidTableDataC2 = JSON.parse(CaseFound.legalAidTableData.C2);
                        legalAidTableDataC2.status = 'Approved';

                      //  console.log(legalAidTableDataC2)
                        await Case.findByIdAndUpdate(req.params.id, {
                            legalAidTableData: {
                                C2: JSON.stringify(legalAidTableDataC2)
                            },
                        })
                        sendMIAM1LinklegalAid(companyData, clientData, messageBodyinfo)


                        let twillioInfo = handleTwillioData(currentComp);
                        let clientNumber = CaseFound.MajorDataC2.phoneNumber
                        let messageBodyData = `Dear ${clientData.clientName},
                        An email with MIAM1 link was sent to you. You may need to check your SPAM folder.
                        Thank you.
                        ${companyData.companyName}
                        `
                        sendSMSwithChangedBody(twillioInfo, clientNumber, messageBodyData, res)

                        res.status(200).json({ res: "MIAM 1 Link has been sent ..." })

                    }
                    else {
                        res.status(400).json({ "message": "error with data ... " })
                    }

                }
                else {
                    res.status(400).json({ "message": "no case found ... " })
                }

            }
            else if (req.userRole == 'mediator') {
                let cases = await mediator.findById(req.user._id).populate('cases');
                for (let i = 0; i < cases.cases.length; i++) {
                    if (cases.cases[i]._id == req.params.id) {

                        CaseFound = (cases.cases[i])
                    }
                }
                if (CaseFound) {

                    const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');
                    let currentComp_ = mediatorCompanyData.companyId

                    if (TargetClient == "C1") {
                        clientData.email = CaseFound.MajorDataC1.mail;
                        //clientData.email = "abdosamir023023@gmail.com"

                        clientData.clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                        companyData.companyName = currentComp_.companyName
                        companyData.email = currentComp_.email
                        messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/C1/${CaseFound._id}`;
                        sendMIAM1LinklegalAid(companyData, clientData, messageBodyinfo);
                        let legalAidTableDataC1 = JSON.parse(CaseFound.legalAidTableData.C1);
                        legalAidTableDataC1.status = 'Approved';

                      //  console.log(legalAidTableDataC1)
                        await Case.findByIdAndUpdate(req.params.id, {
                            legalAidTableData: {
                                C1: JSON.stringify(legalAidTableDataC1)
                            },
                        })







                        let twillioInfo = handleTwillioData(currentComp_);
                        let clientNumber = CaseFound.MajorDataC1.phoneNumber
                        let messageBodyData = `Dear ${clientData.clientName},
                        An email with MIAM1 link was sent to you. You may need to check your SPAM folder.
                        Thank you.
                        ${companyData.companyName}
                        `
                        sendSMSwithChangedBody(twillioInfo, clientNumber, messageBodyData, res)

                        res.status(200).json({ res: "MIAM 1 Link has been sent ..." })



                    }
                    else if (TargetClient == "C2") {
                        clientData.email = CaseFound.MajorDataC2.mail;
                        clientData.clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                        companyData.companyName = currentComp_.companyName
                        companyData.email = currentComp_.email
                        messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/C2/${CaseFound._id}`;

                        let legalAidTableDataC2 = JSON.parse(CaseFound.legalAidTableData.C2);
                        legalAidTableDataC2.status = 'Approved';

                      //  console.log(legalAidTableDataC2)
                        await Case.findByIdAndUpdate(req.params.id, {
                            legalAidTableData: {
                                C2: JSON.stringify(legalAidTableDataC2)
                            },
                        })

                        sendMIAM1LinklegalAid(companyData, clientData, messageBodyinfo);

                        let twillioInfo = handleTwillioData(currentComp_);
                        let clientNumber = CaseFound.MajorDataC2.phoneNumber
                        let messageBodyData = `Dear ${clientData.clientName},
                        An email with MIAM1 link was sent to you. You may need to check your SPAM folder.
                        Thank you.
                        ${companyData.companyName}
                        `
                        sendSMSwithChangedBody(twillioInfo, clientNumber, messageBodyData, res)
                        res.status(200).json({ res: "MIAM 1 Link has been sent ..." })



                    }
                    else {
                        res.status(400).json({ "message": "error with data ... " })
                    }
                }
                else {
                    res.status(400).json({ "message": "no case found ... " })
                }

            }


        }


        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }

});



module.exports = router;