const express = require('express');
const router = express.Router();
const Case = require('../models/case');

router.post('/create-case', async (req, res, next) => {
  try {
    const { firstName, surName, phoneNumber, dateOfMAIM, location } = req.body;
    console.log(req.user);
    const newCase = new Case({
      firstName,
      surName,
      phoneNumber,
      dateOfMAIM,
      location
   
    });

    await newCase.save();

    res.status(201).json({ message: 'Case created successfully', data: newCase });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
