const router = require("express").Router();
const company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");
const verifyTwillio = require("../middleware/twillioVerify");
const CryptoJS = require("crypto-js");



router.patch("/receiveSMS", authMiddleware, async (req, res) => {




  try {
    const express = require('express');
    const { MessagingResponse } = require('twilio').twiml;
    
    const app = express();
    
    app.post('/sms', (req, res) => {
      const twiml = new MessagingResponse();
    
      twiml.message('The Robots are coming! Head for the hills!');
    
      res.type('text/xml').send(twiml.toString());
    });
    
  }
  catch (err) {
    res.json({ err:err.message })
  }
})

module.exports = router

