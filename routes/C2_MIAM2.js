
const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const dateNow = require("../global/dateNow")


/*! لسة فى شغل كتير هنا from scratch */
/** after adding M2 we should send invitaion to  2 clients from data clients */
const sendInvitationFormsForBothClients = function (C1details,C2details, mediationDetails,invitaionLink) {

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
          C1details.fname
          C1details.sname
          C1details.email
          C2details.fname
          C2details.sname
          C2details.email

            mediationDetails.companyName
            mediationDetails.medName
            mediationDetails.email
  لسة هنشوف هنبعت الاتنين زى بعض ولا هنبعت ايه
           invitaionLink.formUrl
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

const validationMail = function (x) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(x)) {
        return true
    } else {
        return false
    }
}

router.patch("/addC2MIAM2/:id", async (req, res) => {

    try {

        let MIAM2mediator = req.body;
        let MIAM_C2_Date = MIAM2mediator.mediationDetails.DateOfMIAM
        let caseSuitable = MIAM2mediator.FinalComments.isSuitable;   // Yes or No

        if (caseSuitable == "Yes") {
            let caseDetails = {}, mediationDetails = {}, messageInfo = {};
            let MajorDataC2 = {
                fName: req.body.mediationDetails.clientFirstName,
                sName: req.body.mediationDetails.clientSurName,
                mail: req.body.mediationDetails.clientEmail,
            }



            let MajorDataC1sName = req.body.mediationDetails.otherPartySurname;

            let currentCase = await Case.findById(req.params.id);

            let Reference = `${MajorDataC1sName} & ${MajorDataC2.sName}`;
            let statusRemider = {
                reminderID: `${currentCase._id}-statusRemider`,
                reminderTitle: `${currentCase.Reference}-MIAM Part 2-C2`,
                startDate: dateNow()
            }


            // caseDetails.C2mail = currentCase.MajorDataC2.mail
            // caseDetails.C2name = `${currentCase.MajorDataC2.fName} ${currentCase.MajorDataC2.sName}`
            // caseDetails.C1name = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`

            //const companyData = await Case.findById(req.params.id).populate('connectionData.companyID');
           // mediationDetails.companyName = companyData.connectionData.companyID.companyName;
            //const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
           // mediationDetails.medName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;
          //  messageInfo.formUrl = `${config.baseUrlC2Invitation}/${config.C2_Invitaion}/${req.params.id}`;
            const stringfyMIAM2Data = JSON.stringify(MIAM2mediator)
            //!currentCase.MIAM2AddedData
            if (true) {
 
                await Case.findByIdAndUpdate(req.params.id, {
                    $set: {
                        'MajorDataC2.fName': MajorDataC2.fName,
                        'MajorDataC2.sName': MajorDataC2.sName,
                        'MajorDataC2.mail': MajorDataC2.mail,
                        'MajorDataC1.sName': MajorDataC1sName,
                        'Reminders.statusRemider': statusRemider,
                        'MIAMDates.MIAM_C2_Date': MIAM_C2_Date, 
                    }, MIAM2mediator: stringfyMIAM2Data, MIAM2AddedData: true, status: "MIAM Part 2-C2",Reference
                })
           

                res.json({ "message": " MIAM2 has been added and Inviation sent to C2" })
            }
            else {
                res.json({ "message": "this MIAM2 has been added before" })
            }

        } else {

            let MajorDataC2 = {
                fName: req.body.mediationDetails.clientFirstName,
                sName: req.body.mediationDetails.clientSurName,
                mail: req.body.mediationDetails.clientEmail,
            }

            let MajorDataC1sName = req.body.mediationDetails.otherPartySurname;

            const stringfyMIAM2Data = JSON.stringify(MIAM2mediator)
            //!currentCase.MIAM2AddedData
            if (true) {

                await Case.findByIdAndUpdate(req.params.id, {
                    $set: {
                       'MajorDataC2.fName': MajorDataC2.fName,
                        'MajorDataC2.sName': MajorDataC2.sName,
                        'MajorDataC2.mail': MajorDataC2.mail,
                        'MajorDataC1.sName': MajorDataC1sName,
                    }, MIAM2mediator: stringfyMIAM2Data,
                    MIAM2AddedData: true,
                    status: "Not suitable for mediation" ,Reference
                })
                res.json({ "message": " MIAM2 has been added with Not Suitable status " })
            }
            else {
                res.json({ "message": "this MIAM2 has been added before" })
            }

        }






    }
    catch (Err) {
        res.json({ "err": Err.message })
    }

});









module.exports = router;
