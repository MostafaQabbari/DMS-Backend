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
const sendingMailsOrSMS = require("./routes/sendingMailsOrSMS")
const reminders = require("./routes/reminders")
const updateCaseStatus= require("./routes/updateCaseStatus")
const C2Invitation= require("./routes/C2_invitation")
const C2MIAM1= require("./routes/C2_MIAM1");
const C2MIAM2 = require("./routes/C2_MIAM2")


const updateCase = require("./routes/updateCase")
const cors = require('cors');
require('dotenv')
const PORT = process.env.PORT || 3007
const app = express();


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve , swaggerUi.setup(swaggerDocument));


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
app.use(sendingMailsOrSMS)
app.use(updateCase)
app.use(updateCaseStatus)
app.use(C2Invitation)
app.use(reminders)
app.use(C2MIAM1)
app.use(C2MIAM2)



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log("Server started on port 3007");
});


module.exports = app;
