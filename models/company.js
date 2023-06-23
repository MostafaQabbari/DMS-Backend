const mongoose = require("mongoose");


const companySchema = new mongoose.Schema({

  companyName: { type: String, required: true , unique: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  companyLogo: { type: String },

  refreshToken: {type: String,default: null,},
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },

  twillioData:{type:String},
 
  mediators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mediator" }],
  cases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Case" }],
  Reminders:[{   
    reminderTitle: { type: String },    
    startDate: { type: String }
  }]

},
  {
    timestamps: true,
  }

);



const Company = mongoose.model("company", companySchema);

module.exports = Company;