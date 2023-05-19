const router = require("express").Router();
const company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");
const verifyTwillio = require("../middleware/twillioVerify");
const CryptoJS = require("crypto-js");






/* 1st - will add company sid,token,number to the DB after validation by sending sms
* as we adding we will encrypt all data object togther before saving in DB
* next code will decrypt data to can use it


*/

router.post("/addTwillio", authMiddleware, verifyTwillio , async (req, res) => {
  if (req.userRole !== "company") {
    return res.status(401).json({ message: "Unauthorized only a company account can configure twillio account" });
  }
  try {

    var cryptedTwilioData = CryptoJS.AES.encrypt(JSON.stringify([req.body]), 'ourTwillioEncyptionKey').toString();
    const userID = req.user._id
    await company.findByIdAndUpdate(userID, { "twillioData": cryptedTwilioData })
    res.json({ "message": " data added to DB with Encryption " })
  }
  catch (err) {
    res.json({ err: "this error after 2 middlewares and try to add data " })
  }
})

module.exports = router

