const router = require("express").Router();
const company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");
const verifyTwillio = require("../middleware/twillioVerify");
const CryptoJS = require("crypto-js");






/* 1st - will add company sid,token,number to the DB after validation by sending sms
* as we adding we will encrypt all data object togther before saving in DB
* next code will decrypt data to can use it


*/

router.patch("/addTwillio", authMiddleware, verifyTwillio, async (req, res) => {




  try {
    if (req.userRole == "admin") {
    
      var cryptedTwilioData = CryptoJS.AES.encrypt(JSON.stringify([req.body.twillioData]), 'ourTwillioEncyptionKey').toString();
      const comp = await company.findOne({ email: req.body.email })
      if (comp) {
        const userID = comp._id;
         console.log("xxx")
        console.log(cryptedTwilioData)
        await company.findByIdAndUpdate(userID, { "twillioData": cryptedTwilioData ,phoneNumberTwillio:req.body.twillioData.twillioNumber })
        res.status(200).json({ "message": " data added to DB with Encryption " })
      } else {
        res.status(404).json({ "message": " not found this email of the company " })
      }


    }
    else {

      return res.status(401).json({ message: "Unauthorized only a admin account can add twillio data" });
    }


  }
  catch (err) {
    res.status(400).json({ err:err.message })
  }
})




module.exports = router

