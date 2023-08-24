function dateFormat (inputDate){
const dateParts = inputDate.split('-');
const year = dateParts[0].slice(-2);
const month = dateParts[1];
const day = dateParts[2];

return `${day}${month}${year}`;
}

function clientUCN(date, firstName, surname) {
  const dateParts = date.split('-');
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  const formattedDate = `${day}${month}${year}`;

  const firstNameInitial = firstName.charAt(0);
  const surnameInitials = surname.substring(0, 4);

  return `${formattedDate}/${firstNameInitial}/${surnameInitials}`;
}

const MIAM2_Statistics_C1 = function(miam2c1 , currentCase,miam1c1){

let statisticsObj = {};
let startDateFormated = dateFormat(currentCase.startDate)
let c1UCN = clientUCN(miam1c1.personalContactAndCaseInfo.dateOfBirth,currentCase.MajorDataC1.fName ,currentCase.MajorDataC1.sName )
let c2UCN = clientUCN(miam2c1.otherParty.otherPartyDateOfBirth,currentCase.MajorDataC2.fName ,currentCase.MajorDataC2.sName )


statisticsObj.date = miam2c1.mediationDetails.DateOfMIAM;
statisticsObj.Type = "MIAM"
statisticsObj.caseReference = currentCase.Reference
statisticsObj.caseStartDate = currentCase.startDate
statisticsObj.claimId = "000"

statisticsObj.uniqueCaseId = `${startDateFormated}/${statisticsObj.claimId}`
statisticsObj.caseConcludedDate =""

statisticsObj.client1ForeName=currentCase.MajorDataC1.fName
statisticsObj.client1surName=currentCase.MajorDataC1.sName
statisticsObj.client1dateOfBirth=miam1c1.personalContactAndCaseInfo.dateOfBirth
statisticsObj.client1UCN=c1UCN
statisticsObj.client1postCode=miam1c1.personalContactAndCaseInfo.postCode
statisticsObj.client1Gender=miam1c1.personalContactAndCaseInfo.gender
statisticsObj.client1Ethincity=miam1c1.personalContactAndCaseInfo.ethnicOrigin
statisticsObj.client1Disability=miam1c1.personalContactAndCaseInfo.disabilityRegistered
statisticsObj.client1LegallyAided=currentCase.caseTypeC1

statisticsObj.client2ForeName=currentCase.MajorDataC2.fName
statisticsObj.client2surName=currentCase.MajorDataC2.sName
statisticsObj.client2dateOfBirth=miam2c1.otherParty.otherPartyDateOfBirth
statisticsObj.client2UCN=c2UCN
statisticsObj.client2postCode=miam2c1.otherParty.otherPartyPostalCode
statisticsObj.client2Gender=""
statisticsObj.client2Ethincity=""
statisticsObj.client2Disability=""
statisticsObj.client2LegallyAided=""

statisticsObj.NoOfMediationSessions=""
statisticsObj.mediationTimePerMins=""

/*
MedsessionLocation📢 =>  clientData.specifyLocation=[]

*/
statisticsObj.outCome=""
statisticsObj.outReachLocation="000|001"
statisticsObj.referral="002|008"

statisticsObj.VATindicator="Y"
statisticsObj.NetDisbursementAmountVAT="undone"
statisticsObj.DisbursementsVATamount=""

statisticsObj.client1PostalApplicationAccepted="N"
statisticsObj.client2PostalApplicationAccepted="N"
statisticsObj.scheduleReferenceOutCome="2P664C/MEDI2018/00"



console.log('📢📢test m2c1')
console.log(statisticsObj)

}


const MIAM2_Statistics_C2 = function(miam2c2 , currentCase,miam1c2 , miam1c1){
  
  let statisticsObj = {};
  let startDateFormated = dateFormat(currentCase.startDate)
  let c1UCN = clientUCN(miam1c2.personalContactAndCaseInfo.dateOfBirth,currentCase.MajorDataC2.fName ,currentCase.MajorDataC2.sName )
  let c2UCN = clientUCN(miam1c2.otherParty.otherPartyDateOfBirth,currentCase.MajorDataC1.fName ,currentCase.MajorDataC1.sName )
  
  
  statisticsObj.date = miam2c2.mediationDetails.DateOfMIAM;
  statisticsObj.Type = "MIAM"
  statisticsObj.caseReference = currentCase.Reference
  statisticsObj.caseStartDate = currentCase.startDate
  statisticsObj.claimId = "000"
  
  statisticsObj.uniqueCaseId = `${startDateFormated}/${statisticsObj.claimId}`
  statisticsObj.caseConcludedDate =""
  
  statisticsObj.client1ForeName=currentCase.MajorDataC2.fName
  statisticsObj.client1surName=currentCase.MajorDataC2.sName
  statisticsObj.client1dateOfBirth=miam1c2.personalContactAndCaseInfo.dateOfBirth
  statisticsObj.client1UCN=c1UCN
  statisticsObj.client1postCode=miam1c2.personalContactAndCaseInfo.postCode
  statisticsObj.client1Gender=miam1c2.personalContactAndCaseInfo.gender
  statisticsObj.client1Ethincity=miam1c2.personalContactAndCaseInfo.ethnicOrigin
  statisticsObj.client1Disability=miam1c2.personalContactAndCaseInfo.disabilityRegistered
  statisticsObj.client1LegallyAided=currentCase.caseTypeC2
  
  statisticsObj.client2ForeName=currentCase.MajorDataC1.fName
  statisticsObj.client2surName=currentCase.MajorDataC1.sName
  statisticsObj.client2dateOfBirth=miam1c2.otherParty.otherPartyDateOfBirth
  statisticsObj.client2UCN=c2UCN
  statisticsObj.client2postCode=miam1c2.otherParty.otherPartyPostalCode


statisticsObj.client2Gender=miam1c1.personalContactAndCaseInfo.gender
statisticsObj.client2Ethincity=miam1c1.personalContactAndCaseInfo.ethnicOrigin
statisticsObj.client2Disability=miam1c1.personalContactAndCaseInfo.disabilityRegistered
statisticsObj.client2LegallyAided=currentCase.caseTypeC1
  
  
  statisticsObj.NoOfMediationSessions=""
  statisticsObj.mediationTimePerMins=""
  
  statisticsObj.outCome=""
  statisticsObj.outReachLocation="000|001"
  statisticsObj.referral="002|008"
  
  statisticsObj.VATindicator="Y"
  statisticsObj.NetDisbursementAmountVAT="undone"
  statisticsObj.DisbursementsVATamount=""
  
  statisticsObj.client1PostalApplicationAccepted="N"
  statisticsObj.client2PostalApplicationAccepted="N"
  statisticsObj.scheduleReferenceOutCome="2P664C/MEDI2018/00"
    console.log('test m2c2')
}

const MedSession_Statistics = function(){
    console.log('test med session')
}


module.exports = { MIAM2_Statistics_C1 ,  MIAM2_Statistics_C2 ,MedSession_Statistics}



/*

{
   
    🤦‍♂️  after miam2 , medsession => make it true 
    date:{type:String},
    🤦‍♂️  after miam2 , medsession => date now function will be date of mediationDetails.DateOfMIAM 
    Type:{type:String},
    🤦‍♂️  after miam2 , medsession => default string 
    caseReference:{type: String },
   🤦‍♂️  after each miam2 , medsession => get from case data 
    caseStartDate:{type: String },
   🤦‍♂️ after each miam2 , medsession => get from case data 


    claimId:{type: String },         daily depend on number of med  001 ... 00n
  🤦‍♂️ after each miam2 , medsession => se default 000 

    uniqueCaseId:{type: String },    daily depend on CaseStartDate/claimId   without slash
  🤦‍♂️ after each miam2 , medsession => se default 000 + formate date getting from case data   

    caseConcludedDate:{type:String },      date of last mediation session record ?
  🤦‍♂️ after each medsession => check if 📢 NextSteps.isFurtherSessionPlanned==No
                                      get 📢 clientData.sessionDate
  
    

    client1ForeName:{type:String },
     🤦‍♂️ after each miam2, medsession => from case data 
    client1surName:{type:String },
    client1dateOfBirth:{type:String },
    client1UCN:{type:String },    =>  DDMMYYYY/N/SURN    date of birth (without forward slash)/First letter of the name/four letter of their surname.  
    client1postCode:{type:String },
     🤦‍♂️ after each miam2, medsession => from case data from MIAM1 
                                        📢 personalContactAndCaseInfo.postCode
     
    client1Gender:{type:String },
      🤦‍♂️ after each miam2, medsession => from case data from MIAM1 
                                        📢 personalContactAndCaseInfo.gender
     
    client1Ethincity:{type:String },
       🤦‍♂️ after each miam2, medsession => from case data from MIAM1 
                                        📢 personalContactAndCaseInfo.ethnicOrigin
     
    client1Disability:{type:String },
     🤦‍♂️ after each miam2, medsession => from case data from MIAM1 
                                        📢 personalContactAndCaseInfo.disabilityRegistered
     
    client1LegallyAided:{type:String },
       🤦‍♂️ after each miam2, medsession => from case data   casteType 

    client2ForeName:{type:String },
    client2surName:{type:String },
    client2dateOfBirth:{type:String },
    client2UCN:{type:String },    =>  DDMMYYYY/N/SURN    date of birth (without forward slash)/First letter of the name/four letter of their surname. 
    client2postCode:{type:String },
    client2Gender:{type:String },
    client2Ethincity:{type:String },
    client2Disability:{type:String },
    client2LegallyAided:{type:String },


    NoOfMediationSessions:{type:String },
    mediationTimePerMins:{type:String },

    outCome:{type:String },   letter from mediationSessionRecord => mediationFinishReason a-b-c-s-p
    outReachLocation:{type:String },  000 => online meeting  , 001=>location

   ❤️ miam2.mediationDetails.Location    Online => 000   , else 001
   ❤️ medsession.clientData.specifyLocation    Online => 000   , else 001

    referral:{type:String },  002 => comeFromCompany  , 008 => come from mediator

          

    for miam , miam1.personalContactAndCaseInfo.howClientFoundDMS == "Solicitor" = > 008 else 002
    for medsession , miam1.personalContactAndCaseInfo.howClientFoundDMS == "Solicitor" = > 008 else 002

    VATindicator:{type:String },   => Y
    NetDisbursementAmountVAT:{type:String },  =>undone
    DisbursementsVATamount:{type:String },  => ""

    client1PostalApplicationAccepted:{type:String },  => N
    client2PostalApplicationAccepted:{type:String },  => N
    scheduleReferenceOutCome:{type:String },  =>   2P664C/MEDI2018/00

  }
*/
