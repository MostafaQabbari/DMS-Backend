const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const client1data = require('../interface/client1prototype')
const caseSchema = new Schema({

  client1ContactDetails:{
    firstName: { type: String },
    surName: { type: String},
    email: { type: String },
    phoneNumber: { type: String },
    dateOfMAIM: { type: String },
    location: { type: String },
  },
  connectionData:{
    mediatorID:  {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Mediator"
    },
    companyID:  {
      type: mongoose.Schema.Types.ObjectId,
      ref:"company"
    }
  },
  
  client1data,
  Reference: { type: String },   //Refrence: C1 Surname & C2 Surnme => which be in conflict 
  client1AddedData:{type:Boolean , default:false},



});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
