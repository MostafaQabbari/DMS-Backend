const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const { jwtSecret } = require("./config/config");
const authRoutes = require("./routes/auth");
const caseRoutes = require("./routes/case");
const companyRoutes = require("./routes/company");
const C1MIAM1 = require("./routes/C1_MIAM1");
const pdfConvertor = require("./routes/pdfConvertor");
const configureTwillio = require("./routes/configureTwillio")
const getMediators = require("./routes/getMediators");
const C1MIAM2 = require("./routes/C1_MIAM2")
const getDataFromCSV = require("./routes/getDataFromCSV")
const sendingForms_MailsOrSMS = require("./routes/sendingForms_MailsOrSMS")
const reminders = require("./routes/reminders")
const updateCaseStatus= require("./routes/updateCaseStatus")
const C2Invitation= require("./routes/C2_invitation")
const C2MIAM1= require("./routes/C2_MIAM1");
const C2MIAM2 = require("./routes/C2_MIAM2");
const recieveSMS = require("./routes/receiveSMS")
const legalAid_forms_C1 = require("./routes/legalAid_Forms_C1")

const ScheduleMeetings = require('./routes/ScheduleMeetings')
const agreementForm = require('./routes/agreementForm')
const mediationSession=require('./routes/Mediation_Session')
const sendManualSMS = require('./routes/sendmanualSMS')
const sendMails = require('./routes/sendMails')
const updateCase = require("./routes/updateCase")
const appointmentConf = require('./routes/appoinmentConformation')
const cim = require('./routes/porperty&CIMmail');
const courtForm = require ('./routes/sendCourtForm');
const caseLog= require('./routes/caseLog');
const compStatistics = require('./routes/getCompStatistics')
const confirmationMail=require('./routes/confirmationMail');

const replaceMediator = require('./routes/replaceMediator');
const updateMediatorData= require("./routes/updateMediatorData")



const cors = require('cors');
require('dotenv')
const PORT = process.env.PORT || 3007
const app = express();




mongoose.connect("mongodb+srv://mkabary8:O8uafwuq79PBkJoJ@cluster1.xnqqhnm.mongodb.net/users", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'uploads')))

app.use("/auth", authRoutes);
app.use("/", caseRoutes);
app.use("/", companyRoutes);
app.use("/", pdfConvertor);
app.use(configureTwillio);
app.use(C1MIAM1)
app.use(getMediators)
app.use(C1MIAM2)
app.use(getDataFromCSV)
app.use(sendingForms_MailsOrSMS)
app.use(updateCase)
app.use(updateCaseStatus)
app.use(C2Invitation)
app.use(reminders)
app.use(C2MIAM1)
app.use(C2MIAM2)

app.use(recieveSMS)
app.use(legalAid_forms_C1)
app.use(ScheduleMeetings)
app.use(agreementForm)
app.use(mediationSession)
app.use(sendManualSMS)
app.use(sendMails)
app.use(appointmentConf)
app.use(cim)
app.use(courtForm)
app.use(caseLog)

app.use(compStatistics)
app.use(confirmationMail)

app.use(replaceMediator)
app.use(updateMediatorData)



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log("Server started on port 3007");
});


module.exports = app;
