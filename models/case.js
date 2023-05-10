const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const caseSchema = new Schema({

  client1ContactDetails:{
    firstName: { type: String },
    surName: { type: String},
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
  }


});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
