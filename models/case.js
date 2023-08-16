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
    caseType:{type:String , required:true}  ,   //private , LegalAid , passporting , lowIncome
    legalAidType:{type:String}
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

  caseTypeC1:{type:String},
  caseTypeC2:{type:String},
  passporting_C1:{type: String},
  lowIncome_C1:{type: String},
  client1data: { type: String },
  client1AddedData: { type: Boolean, default: false },
  MIAM2mediator: { type: String },
  MIAM2AddedData: { type: Boolean, default: false },

  passporting_C2:{type: String},
  lowIncome_C2:{type: String},
  client2data: { type: String },
  client2AddedData: { type: Boolean, default: false },
  MIAM2C2: { type: String },
  MIAM2C2AddedData: { type: Boolean, default: false },

  C2invitation: { type: String },
  C2invitationApplied: { type: Boolean, default: false },


  C1Agreement: { type: String },
  C1AgreementApplied: { type: Boolean, default: false },
  C2Agreement: { type: String },
  C2AgreementApplied: { type: Boolean, default: false },

  mediationRecords:[{type:String}],
  mediationSessionsNo:{type:Number ,default:0},

  
  availableTimes_C1:{
    whatDaysCanNotAttend:{type:String},
    appointmentTime:{type:String}
  },
  
  phoneCallAppointment_C2_C2reply:[{type: String}],
  availableTimes_C2:{
    whatDaysCanNotAttend:{types:String},
    appointmentTime:{types:String}
  },

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
  MIAMDates: {
    MIAM_C1_Date: { type: String },
    MIAM_C2_Date: { type: String },

    MIAM_sessions_Dates: [{
      sessionNo: { type: Number },
      sessionDate: { type: String }
    }]
    ,
    
  },

  Reminders: {
    statusRemider: {
      reminderID: { type: String },      // ID =>   caseID + "statusRemider" keyWord
      reminderTitle: { type: String },    // title   =>  ReferenceCase + StatusValue
      startDate: { type: String }
    },
    eventReminders:[{
      reminderTitle: { type: String },   
      startDate: { type: String }
    }]
  },



  status: { type: String, default: "MIAM Part 1-C1" },
  closed: { type: Boolean, default: false },
  folderID:{type: String},
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
            "Invitation to C2 sent"


            "Proceeding with mediation"
            "Not Proceeding with mediation"

            "Mediation Session 1..n"
            "Agreed" / "Successful" / "Broken"


            
            "Not suitable for mediation"
            "Closed"
 */

