const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const caseSchema = new Schema({

  Reference: { type: String },   //Refrence: C1 Surname & C2 Surnme => which be in conflict 

  startDate:{type:String},   // data from MIAM
  client1ContactDetails: {
    firstName: { type: String },
    surName: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    dateOfMAIM: { type: Date },
    location: { type: String },
  },
  connectionData: {
    mediatorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mediator"
    },
    companyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company"
    }
  },

  client1data: { type: String },
  client1AddedData: { type: Boolean, default: false },
  MIAM2mediator: { type: String },
  MIAM2AddedData: { type: Boolean, default: false },

  client2data: { type: String },
  client2AddedData: { type: Boolean, default: false },
  MIAM2C2: { type: String },
  MIAM2C2AddedData: { type: Boolean, default: false },
  status: { type: String, default: "MIAM1 sent to C1" },
  closed: { type: Boolean, default: false },
},
  {
    timestamps: true,
  }
);

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;


/**
 
 Case status – 
            "C1 MIAM Part 1 Applied"
            "C1 MIAM Part 2 Applied"
            "Invitation to C2 sent"
            "Not suitable for mediation"
            "C2 MIAM Part 1 Applied"
           "C2 MIAM Part 2 Applied"
            "Case Closed"
            "Proceeding with mediation"
            "Mediation Session 1..n"
           "Mediation Agreed" / "Mediation Successful" / "Mediation Broken up"

 */

