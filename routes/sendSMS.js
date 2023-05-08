const router = require("express").Router();
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");



/* 1st - will add company sid,token,number to the DB after validation by sending sms */

router.post("/addTwillioDetails" ,authMiddleware, async (req , res)=>{

    const {sid , token , number} = req.body

    res.json("xxx")

})



module.exports= router


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