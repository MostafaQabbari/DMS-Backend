const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MIAM2mediator = require('../interface/MIAM2Medaitor');

const caseSchema = new Schema({

  Reference: { type: String },   //Refrence: C1 Surname & C2 Surnme => which be in conflict 
  client1ContactDetails:{
    firstName: { type: String },
    surName: { type: String},
    email: { type: String },
    phoneNumber: { type: String },
    dateOfMAIM: { type: Date},
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
  
  client1data:{type:String},
  client1AddedData:{type:Boolean , default:false},
  MIAM2mediator,
  MIAM2AddedData:{type:Boolean , default:false},



});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
