const router = require("express").Router();
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");
const verifyTwillio = require("../middleware/twillioVerify");
const CryptoJS = require("crypto-js");






/* 1st - will add company sid,token,number to the DB after validation by sending sms */

router.post("/addTwillio", authMiddleware, verifyTwillio, async (req, res) => {

  if (req.userRole !== "company") {
    return res.status(401).json({ message: "Unauthorized only a company account can configure twillio account" });
  }


  try {
    const userID = req.user._id

    var cryptedTwilioData = CryptoJS.AES.encrypt(JSON.stringify(req.body), 'secret key 123').toString();

    await company.findByIdAndUpdate(userID, { "twillioData": cryptedTwilioData })


    //   var bytes  = CryptoJS.AES.decrypt(req.user.twillioData, 'secret key 123');
    //  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    res.json({ "message": " data added to DB with Encryption " })


  }
  catch (err) {

    res.json({ err: "this error after 2 middlewares and try to add data " })
  }





})



module.exports = router


/* 2nd - will use function which take data from DB and send the SMS */

/**
 * function callTwi(accountSid, authToken) {
  const x = require('twilio')(accountSid, authToken);

  const phoneNumber = '+1 607 318 318 1083';
    x.messages.create({
      body: 'test tanni ya 3ammm ',
      from: phoneNumber,
      to: '+201553499532'
    })
      .then(message => console.log(message.sid))
      .catch((err) => {
        console.log(err.status);
      });     

}





callTwi('ACe5228e457f3a20a7cfdf7f62ea75fd97', '02b98acbb8772f33e793696e19b00de5')

 */