const mongoose = require("mongoose");


const companySchema = new mongoose.Schema({
  
  companyName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  companyLogo: { type: String },
  
});



const Company = mongoose.model("company", companySchema);

module.exports = Company;