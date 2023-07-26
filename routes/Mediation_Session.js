const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const mediator = require('../models/mediator');
const Company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");
const dateNow = require('../global/dateNow')

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

router.patch("/addMediationRecord/:id", async (req, res) => {
    try {


        let currentCase = await Case.findById(req.params.id);
        let mediationRecord = req.body;
        const StringfyData = JSON.stringify(mediationRecord);


        if (req.body.NextSteps.isFurtherSessionPlanned == "Yes") {

            await Case.findByIdAndUpdate(req.params.id, {
                $inc: { mediationSessionsNo: 1 }
            })
            const updatedCase = await Case.findById(req.params.id);
            console.log(updatedCase.mediationSessionsNo)

            let statusRemider = {
                reminderID: `${updatedCase._id}-statusRemider`,
                reminderTitle: `${updatedCase.Reference}-Mediation Session ${updatedCase.mediationSessionsNo}`,
                startDate: dateNow()
            }

            await Case.findByIdAndUpdate(req.params.id, {
                $push: { mediationRecords: StringfyData },
                $set: {
                    'Reminders.statusRemider': statusRemider
                }, status: `Mediation Session ${updatedCase.mediationSessionsNo}`
            })

        }

        else if (req.body.NextSteps.isFurtherSessionPlanned == "No" &&
            req.body.NextSteps.mediationFinishReason == "B - Mediation broken down/no longer suitable"
        ) {

            let statusRemider = {
                reminderID: `${updatedCase._id}-statusRemider`,
                reminderTitle: `${updatedCase.Reference}-Broken`,
                startDate: dateNow()
            }

            await Case.findByIdAndUpdate(req.params.id, {
                $push: { mediationRecords: StringfyData },
                $set: {
                    'Reminders.statusRemider': statusRemider
                }, status: `Broken`, closed: true
            })

        }


        else if (req.body.NextSteps.isFurtherSessionPlanned == "No" &&
            req.body.NextSteps.mediationFinishReason == "A - All/Some matters agreed"
        ) {

            let statusRemider = {
                reminderID: `${updatedCase._id}-statusRemider`,
                reminderTitle: `${updatedCase.Reference}-Agreed`,
                startDate: dateNow()
            }

            await Case.findByIdAndUpdate(req.params.id, {
                $push: { mediationRecords: StringfyData },
                $set: {
                    'Reminders.statusRemider': statusRemider
                }, status: `Agreed`, closed: true
            })

        }
        else if (req.body.NextSteps.isFurtherSessionPlanned == "No" &&
            req.body.NextSteps.mediationFinishReason == "C - Successful - Parenting plan to be written" ||
            req.body.NextSteps.mediationFinishReason == "P - Successful - MOU to be written" ||
            req.body.NextSteps.mediationFinishReason == "S - Successful - Most matters agreed and/or PP and/or MOU to be written"
        ) {

            let statusRemider = {
                reminderID: `${updatedCase._id}-statusRemider`,
                reminderTitle: `${updatedCase.Reference}-Successful`,
                startDate: dateNow()
            }

            await Case.findByIdAndUpdate(req.params.id, {
                $push: { mediationRecords: StringfyData },
                $set: {
                    'Reminders.statusRemider': statusRemider
                }, status: `Successful`, closed: true
            })

        }





        // const companyData = await Case.findById(currentCase._id).populate('connectionData.companyID');
        //   const companyEmail = companyData.connectionData.companyID.email;
        //  const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
        //  let mediatorData = {}, clientData = {}, messageBodyinfo = {};
        //  mediatorData.name = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;
        // const medEmail = medData.connectionData.mediatorID.email;
        //  mediatorData.email = medEmail
        //    const updatedCase = await Case.findById(req.params.id);

        //    const parsedClientData = JSON.parse(updatedCase.client1data)

        //    clientData.fname = parsedClientData.personalContactAndCaseInfo.firstName;
        //    clientData.surName = parsedClientData.personalContactAndCaseInfo.surName;
        //    messageBodyinfo.formUrl = `${config.baseUrlMIAM2}/${config.MIAM_PART_2}/C1/${updatedCase._id}`;

        res.status(200).json({ "message": "Mediation session record has been added" })




    } catch (err) {
        res.status(400).json(err.message)
    }


});

module.exports = router