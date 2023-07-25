const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const mediator = require('../models/mediator');
const Company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");

const MailRecordFormToMed = function (mediatorData, caseData) {

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

    /*
mediatorData.email
mediatorData.name

caseData.caseReference
caseData.caseID
    */


    let info = transporter.sendMail({
        from: config.companyEmail,
        to: mediatorData.email,
        subject: `Mediation Session Record Form for  ${caseData.caseReference} `,
        html: `<body>
        <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
        <h1>Hello ${mediatorData.name}  </h1>
        <h3>Here is the session record form link for ${caseData.caseReference} case </h3>
        <a>${config.baseUrlRecordSessionForm}/${config.RecordSessionForm}/${caseData.caseID}</a>
        <p> Best Regards </p>
        <p>DMS's Team </p> 
        </div>
        </body>`,

    });

}
router.post("/sendRecordFormToMediator/:id", authMiddleware, async (req, res) => {
    try {
        if (req.userRole == "company") {
            let CaseFoundID
            let comp = await Company.findById(req.user._id);

            for (let i = 0; i < comp.cases.length; i++) {


                if (comp.cases[i] == req.params.id) {

                    CaseFoundID = (comp.cases[i])

                }
            }

            if (CaseFoundID) {

                let mediatorData = {}, caseData = {}

                const currentMediator = await Case.findById(req.params.id).populate('connectionData.mediatorID');
                mediatorData.email = currentMediator.connectionData.mediatorID.email;
                mediatorData.name = `${currentMediator.connectionData.mediatorID.firstName} ${currentMediator.connectionData.mediatorID.lastName} `;
                const currentCase = await Case.findById(req.params.id)
                caseData.caseReference = currentCase.Reference
                caseData.caseID = req.params.id

                MailRecordFormToMed(mediatorData, caseData)
                res.status(200).json({ "message": "Mediatio session record has been sent to the mediator " })
            } else {
                res.status(400).json("something wrong with accessing this case ... ")
            }
        }
        else {
            res.status(400).json("something wrong with auth ... ")
        }

    } catch (err) {
        res.status(400).json(err.message)
    }


});


module.exports = router