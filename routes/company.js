const express = require("express");
const router = express.Router();
const Company = require("../models/company");

router.get("/companies", async (req, res, next) => {
  try {
    const users = await Company.find({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;