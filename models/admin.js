const mongoose = require("mongoose");


const adminSchema = new mongoose.Schema({

  
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  refreshToken: {type: String,default: null,},
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },

},


);



const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;