const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const caseSchema = new Schema({

  Reference: { type: String },   //Refrence: C1 Surname & C2 Surnme => which be in conflict 

  startDate: { type: String },   // data from MIAM
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

  C2invitation: { type: String },
  C2invitationApplied: { type: Boolean, default: false },

  MajorDataC1: {
    fName: { type: String },
    sName: { type: String },
    mail: { type: String },
    phoneNumber: { type: String }
  },

  MajorDataC2: {
    fName: { type: String },
    sName: { type: String },
    mail: { type: String },
    phoneNumber: { type: String }
  },

  Reminders:{
    statusRemider: {
      reminderID: { type: String },      // ID =>   caseID + "statusRemider" keyWord
      reminderTitle: { type: String },    // title   =>  ReferenceCase + StatusValue
      startDate: { type: Date }
    }
  },

  

 







  status: { type: String, default: "MIAM Part 1-C1" },
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
            "MIAM Part 1-C1"
            "MIAM Part 2-C1"
            "MIAM Part 1-C2"
            "MIAM Part 2-C2"
            "Proceeding with mediation"
            "Not Proceeding with mediation"
            "Mediation Session 1..n"
            "Agreed" / "Successful" / "Broken"
            "Invitation to C2 sent"
            "Not suitable for mediation"
            "Closed"
 */

