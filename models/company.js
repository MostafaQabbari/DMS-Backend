const mongoose = require("mongoose");


const companySchema = new mongoose.Schema({

  companyName: { type: String, required: true , unique: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  sharingGmail: { type: String },
  companyLogo: { type: String },
  logo : {type: String},

  phoneNumberTwillio:{type:String},
  refreshToken: {type: String,default: null,},
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },

  twillioData:{type:String},
  
  serviceAccountID:{type:String},
  serviceAccount:{type:String},
  serviceAccountKey:{type:String},
  
 
  mediators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mediator" }],
  cases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Case" }],
  Reminders:[{   
    reminderTitle: { type: String },    
    startDate: { type: String }
  }],

  statistics:[{
    // readyTrigger:{type:Boolean , default:false},
    /*🤦‍♂️  after miam2 , medsession => make it true */
    date:{type:String},
    /*🤦‍♂️  after miam2 , medsession => date now function will be date of mediationDetails.DateOfMIAM */
    Type:{type:String},
    /*🤦‍♂️  after miam2 , medsession => default string */
    caseReference:{type: String },
   /*🤦‍♂️  after each miam2 , medsession => get from case data */
    caseStartDate:{type: String },
   /*🤦‍♂️ after each miam2 , medsession => get from case data */


    claimId:{type: String },        // daily depend on number of med  001 ... 00n
  /*🤦‍♂️ after each miam2 , medsession => se default 000 */

    uniqueCaseId:{type: String },   // daily depend on CaseStartDate/claimId   without slash
  /*🤦‍♂️ after each miam2 , medsession => se default 000 + formate date getting from case data */  

    caseConcludedDate:{type:String },    //  date of last mediation session record ?
  /*🤦‍♂️ after each medsession => check if 📢 NextSteps.isFurtherSessionPlanned==No
                                      get 📢 clientData.sessionDate
  
  */  

    client1ForeName:{type:String },
     /*🤦‍♂️ after each miam2, medsession => from case data */
    client1surName:{type:String },
    client1dateOfBirth:{type:String },
    client1UCN:{type:String },   // =>  DDMMYYYY/N/SURN    date of birth (without forward slash)/First letter of the name/four letter of their surname.  
    client1postCode:{type:String },
     /*🤦‍♂️ after each miam2, medsession => from case data from MIAM1 
                                        📢 personalContactAndCaseInfo.postCode
     */
    client1Gender:{type:String },
      /*🤦‍♂️ after each miam2, medsession => from case data from MIAM1 
                                        📢 personalContactAndCaseInfo.gender
     */
    client1Ethincity:{type:String },
       /*🤦‍♂️ after each miam2, medsession => from case data from MIAM1 
                                        📢 personalContactAndCaseInfo.ethnicOrigin
     */
    client1Disability:{type:String },
     /*🤦‍♂️ after each miam2, medsession => from case data from MIAM1 
                                        📢 personalContactAndCaseInfo.disabilityRegistered
     */
    client1LegallyAided:{type:String },
       /*🤦‍♂️ after each miam2, medsession => from case data   casteType */

    client2ForeName:{type:String },
    client2surName:{type:String },
    client2dateOfBirth:{type:String },
    client2UCN:{type:String },   // =>  DDMMYYYY/N/SURN    date of birth (without forward slash)/First letter of the name/four letter of their surname. 
    client2postCode:{type:String },
    client2Gender:{type:String },
    client2Ethincity:{type:String },
    client2Disability:{type:String },
    client2LegallyAided:{type:String },


    NoOfMediationSessions:{type:String },
    mediationTimePerMins:{type:String },

    outCome:{type:String },   //letter from mediationSessionRecord => mediationFinishReason a-b-c-s-p
    outReachLocation:{type:String }, // 000 => online meeting  , 001=>location
    referral:{type:String }, // 002 => comeFromCompany  , 008 => come from mediator

    VATindicator:{type:String },  // => Y
    NetDisbursementAmountVAT:{type:String }, // =>undone
    DisbursementsVATamount:{type:String }, // => ""

    client1PostalApplicationAccepted:{type:String }, // => N
    client2PostalApplicationAccepted:{type:String }, // => N
    scheduleReferenceOutCome:{type:String }, // =>   2P664C/MEDI2018/00

  }]




},
  {
    timestamps: true,
  }

);



const Company = mongoose.model("company", companySchema);

module.exports = Company;