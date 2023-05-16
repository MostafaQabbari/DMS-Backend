const express = require("express");
const mongoose = require("mongoose");
const { jwtSecret } = require("./config/config");
const authRoutes = require("./routes/auth");
const caseRoutes = require("./routes/case");
const companyRoutes = require("./routes/company");
const client1Form = require("./routes/clinet1data");

const smsRouts = require("./routes/sendSMS.js")
const cors = require('cors');
require('dotenv')

const PORT = process.env.PORT || 3007
const app = express();

mongoose
  .connect("mongodb+srv://mkabary8:O8uafwuq79PBkJoJ@cluster1.xnqqhnm.mongodb.net/users", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });

app.use(express.json());

app.use(cors())

app.use("/auth", authRoutes);
app.use("/", caseRoutes);
app.use("/", companyRoutes);
app.use(smsRouts);
app.use(client1Form)





app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log("Server started on port 3007");
});



