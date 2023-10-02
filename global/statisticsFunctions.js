function dateFormat(inputDate) {
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

function creatDisabiltySymbols(arrOfDisability) {
  let disabilitiesArr =[]

  for (let i = 0; i < arrOfDisability.length; i++) {


    if(arrOfDisability[i]=="No disabilities (NCD)") disabilitiesArr.push("NCD") 
    if(arrOfDisability[i]== "Mental health condition (MHC)") disabilitiesArr.push("MHC")
    if(arrOfDisability[i]=="Mobility impairment (MOB)") disabilitiesArr.push("MOB") 
    if(arrOfDisability[i]== "Long standing illness or Health Condition (ILL)") disabilitiesArr.push("ILL")
    if(arrOfDisability[i]=="Blind (BLI)") disabilitiesArr.push("BLI")
    if(arrOfDisability[i]== "Visual impairment (VIS)") disabilitiesArr.push("VIS")
    if(arrOfDisability[i]=="Deaf (DEA)") disabilitiesArr.push("DEA")
    if(arrOfDisability[i]== "Hearing impaired (HEA)") disabilitiesArr.push("HEA")
    if(arrOfDisability[i]=="Unknown (UKN)") disabilitiesArr.push("UKN")
    if(arrOfDisability[i]=="Cognitive impairment (COG)") disabilitiesArr.push("COG")
    if(arrOfDisability[i]== "Physical impairment (PHY)") disabilitiesArr.push("PHY")
    if(arrOfDisability[i]=="Learning disability/difficulty (LDD)") disabilitiesArr.push("LDD")
    if(arrOfDisability[i]=="Other (OTH)") disabilitiesArr.push("OTH");
    
   

  }
  let result = disabilitiesArr.join(',')
 
  return result

}
function getCapitalizedFirstLetter(inputString) {
  if (inputString.length === 0) {
    return null; 
  }

  return inputString.charAt(0).toUpperCase();
}

function checkPrivateCase(caseType){
  if(caseType==="Private") return "N"
  else return "Y"

}
function getEthincityNumber(ethincityValue) {
  let result = ethincityValue.indexOf('-');
  
  if (result === -1) {
    return ethincityValue; 
  }

  return ethincityValue.substring(0, result);
}
function getSessionNo(inputString) {
  let matches = inputString.match(/\d+/); 
  
  if (matches) {
    return parseInt(matches[0]); 
  } else {
    return null;
  }
}

function formatStartDate(inputDate) {
  const dateParts = inputDate.split('-');
  if (dateParts.length !== 3) {
    return "Invalid date format";
  }
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

const MIAM2_Statistics_C1 = function (miam2c1, currentCase, miam1c1) {

  let statisticsObj = {};
  let startDateFormated = dateFormat(currentCase.startDate)
  let c1UCN = clientUCN(miam1c1.personalContactAndCaseInfo.dateOfBirth, currentCase.MajorDataC1.fName, currentCase.MajorDataC1.sName)
  let c2UCN = clientUCN(miam1c1.otherParty.otherPartyDateOfBirth, currentCase.MajorDataC2.fName, currentCase.MajorDataC2.sName)


  statisticsObj.date = miam2c1.mediationDetails.DateOfMIAM;
  statisticsObj.Type = "MIAM"
  statisticsObj.caseReference = currentCase.Reference
  statisticsObj.caseStartDate =formatStartDate(currentCase.startDate) 
  statisticsObj.claimId = "000"

  statisticsObj.uniqueCaseId = `${startDateFormated}/${statisticsObj.claimId}`
  statisticsObj.caseConcludedDate = ""

  statisticsObj.client1ForeName = currentCase.MajorDataC1.fName
  statisticsObj.client1surName = currentCase.MajorDataC1.sName
  statisticsObj.client1dateOfBirth = miam1c1.personalContactAndCaseInfo.dateOfBirth
  statisticsObj.client1UCN = c1UCN
  statisticsObj.client1postCode = miam1c1.personalContactAndCaseInfo.postCode
  statisticsObj.client1Gender =getCapitalizedFirstLetter(miam1c1.personalContactAndCaseInfo.gender) 
  statisticsObj.client1Ethincity =getEthincityNumber( miam1c1.personalContactAndCaseInfo.ethnicOrigin)
  statisticsObj.client1Disability =creatDisabiltySymbols(miam1c1.personalContactAndCaseInfo.disabilityRegistered) 
  statisticsObj.client1LegallyAided =checkPrivateCase(currentCase.caseTypeC1) 

  // statisticsObj.client2ForeName = currentCase.MajorDataC2.fName
  // statisticsObj.client2surName = currentCase.MajorDataC2.sName
  // statisticsObj.client2dateOfBirth = miam1c1.otherParty.otherPartyDateOfBirth
  // statisticsObj.client2UCN = c2UCN
  // statisticsObj.client2postCode = miam1c1.otherParty.otherPartyPostalCode
  statisticsObj.client2ForeName = ""
  statisticsObj.client2surName =''
  statisticsObj.client2dateOfBirth =""
  statisticsObj.client2UCN = ''
  statisticsObj.client2postCode = ""
  statisticsObj.client2Gender = ""
  statisticsObj.client2Ethincity = ""
  statisticsObj.client2Disability = ""
  statisticsObj.client2LegallyAided = ""

  statisticsObj.NoOfMediationSessions = ""
  statisticsObj.mediationTimePerMins = ""

  /*
  MedsessionLocation📢 =>  clientData.specifyLocation=[]
  
  */
  statisticsObj.outCome = ""


  if (miam2c1.mediationDetails.Location == "Online") {
    statisticsObj.outReachLocation = "000"
  }
  else {
    statisticsObj.outReachLocation = "001"
  }
  if (miam1c1.personalContactAndCaseInfo.howClientFoundDMS == "Solicitor") {
    statisticsObj.referral = "008"
  } else {
    statisticsObj.referral = "002"
  }


  statisticsObj.VATindicator = "Y"
  statisticsObj.NetDisbursementAmountVAT = "undone"
  statisticsObj.DisbursementsVATamount = ""

  statisticsObj.client1PostalApplicationAccepted = "N"
  statisticsObj.client2PostalApplicationAccepted = "N"
  statisticsObj.scheduleReferenceOutCome = "2P664C/MEDI2018/00"

  return statisticsObj

}


const MIAM2_Statistics_C2 = function (miam2c2, currentCase, miam1c2, miam1c1) {

  let statisticsObj = {};
  let startDateFormated = dateFormat(currentCase.startDate)
  let c1UCN = clientUCN(miam1c2.personalContactAndCaseInfo.dateOfBirth, currentCase.MajorDataC2.fName, currentCase.MajorDataC2.sName)
  let c2UCN = clientUCN(miam1c2.otherParty.otherPartyDateOfBirth, currentCase.MajorDataC1.fName, currentCase.MajorDataC1.sName)


  statisticsObj.date = miam2c2.mediationDetails.DateOfMIAM;
  statisticsObj.Type = "MIAM"
  statisticsObj.caseReference = currentCase.Reference
  statisticsObj.caseStartDate = formatStartDate(currentCase.startDate)
  statisticsObj.claimId = "000"

  statisticsObj.uniqueCaseId = `${startDateFormated}/${statisticsObj.claimId}`
  statisticsObj.caseConcludedDate = ""

  statisticsObj.client1ForeName = currentCase.MajorDataC2.fName
  statisticsObj.client1surName = currentCase.MajorDataC2.sName
  statisticsObj.client1dateOfBirth = miam1c2.personalContactAndCaseInfo.dateOfBirth
  statisticsObj.client1UCN = c1UCN
  statisticsObj.client1postCode = miam1c2.personalContactAndCaseInfo.postCode
  statisticsObj.client1Gender = getCapitalizedFirstLetter(miam1c2.personalContactAndCaseInfo.gender) 
  statisticsObj.client1Ethincity =getEthincityNumber(miam1c2.personalContactAndCaseInfo.ethnicOrigin)
  statisticsObj.client1Disability =creatDisabiltySymbols(miam1c2.personalContactAndCaseInfo.disabilityRegistered) 
  statisticsObj.client1LegallyAided =checkPrivateCase(currentCase.caseTypeC2) 

  // statisticsObj.client2ForeName = currentCase.MajorDataC1.fName
  // statisticsObj.client2surName = currentCase.MajorDataC1.sName
  // statisticsObj.client2dateOfBirth = miam1c2.otherParty.otherPartyDateOfBirth
  // statisticsObj.client2UCN = c2UCN
  // statisticsObj.client2postCode = miam1c2.otherParty.otherPartyPostalCode
  // statisticsObj.client2Gender = getCapitalizedFirstLetter(miam1c1.personalContactAndCaseInfo.gender)
  // statisticsObj.client2Ethincity =getEthincityNumber(miam1c1.personalContactAndCaseInfo.ethnicOrigin) 
  // statisticsObj.client2Disability =creatDisabiltySymbols(miam1c1.personalContactAndCaseInfo.disabilityRegistered) 
  // statisticsObj.client2LegallyAided =checkPrivateCase(currentCase.caseTypeC1)

  statisticsObj.client2ForeName = ""
  statisticsObj.client2surName = ""
  statisticsObj.client2dateOfBirth = ""
  statisticsObj.client2UCN = ""
  statisticsObj.client2postCode = ''
  statisticsObj.client2Gender = ""
  statisticsObj.client2Ethincity = ""
  statisticsObj.client2Disability ="" 
  statisticsObj.client2LegallyAided = ""


  statisticsObj.NoOfMediationSessions = ""
  statisticsObj.mediationTimePerMins = ""
  statisticsObj.outCome = ""

  if (miam2c2.mediationDetails.Location == "Online") {
    statisticsObj.outReachLocation = "000"
  }
  else {
    statisticsObj.outReachLocation = "001"
  }
  if (miam1c2.personalContactAndCaseInfo.howClientFoundDMS == "Solicitor") {
    statisticsObj.referral = "008"
  } else {
    statisticsObj.referral = "002"
  }


  statisticsObj.VATindicator = "Y"
  statisticsObj.NetDisbursementAmountVAT = "undone"
  statisticsObj.DisbursementsVATamount = ""

  statisticsObj.client1PostalApplicationAccepted = "N"
  statisticsObj.client2PostalApplicationAccepted = "N"
  statisticsObj.scheduleReferenceOutCome = "2P664C/MEDI2018/00"

  return statisticsObj
}





const MedSession_Statistics = function (medsession, currentCase) {

 // console.log("xxxxxxxxxxx")
  let statisticsObj = {};
  let startDateFormated = dateFormat(currentCase.startDate)
  const MIAM1_C1 = JSON.parse(currentCase.client1data)
  const MIAM1_C2 = JSON.parse(currentCase.client2data)
//  console.log(MIAM1_C1)
//  console.log(MIAM1_C2)

  let c1UCN = clientUCN(MIAM1_C1.personalContactAndCaseInfo.dateOfBirth, currentCase.MajorDataC1.fName, currentCase.MajorDataC1.sName)
  let c2UCN = clientUCN(MIAM1_C2.personalContactAndCaseInfo.dateOfBirth, currentCase.MajorDataC2.fName, currentCase.MajorDataC2.sName)


  statisticsObj.date = medsession.clientData.sessionDate;
  statisticsObj.Type = "Mediation Session"
  statisticsObj.caseReference = currentCase.Reference
  statisticsObj.caseStartDate =formatStartDate(currentCase.startDate)
  statisticsObj.claimId = "000"

  statisticsObj.uniqueCaseId = `${startDateFormated}/${statisticsObj.claimId}`;

  if (medsession.NextSteps.isFurtherSessionPlanned == 'No') {
    statisticsObj.caseConcludedDate = medsession.clientData.sessionDate
  }
  else {
    statisticsObj.caseConcludedDate = ""
  }

  statisticsObj.caseConcludedDate = ""

  statisticsObj.client1ForeName = currentCase.MajorDataC1.fName
  statisticsObj.client1surName = currentCase.MajorDataC1.sName
  statisticsObj.client1dateOfBirth = MIAM1_C1.personalContactAndCaseInfo.dateOfBirth
  statisticsObj.client1UCN = c1UCN
  statisticsObj.client1postCode = MIAM1_C1.personalContactAndCaseInfo.postCode
  statisticsObj.client1Gender =getCapitalizedFirstLetter(MIAM1_C1.personalContactAndCaseInfo.gender) 
  statisticsObj.client1Ethincity =getEthincityNumber(MIAM1_C1.personalContactAndCaseInfo.ethnicOrigin) 
  statisticsObj.client1Disability =creatDisabiltySymbols(MIAM1_C1.personalContactAndCaseInfo.disabilityRegistered) 
  statisticsObj.client1LegallyAided =checkPrivateCase(currentCase.caseTypeC1) 

  statisticsObj.client2ForeName = currentCase.MajorDataC2.fName
  statisticsObj.client2surName = currentCase.MajorDataC2.sName
  statisticsObj.client2dateOfBirth = MIAM1_C2.personalContactAndCaseInfo.dateOfBirth
  statisticsObj.client2UCN = c2UCN
  statisticsObj.client2postCode = MIAM1_C2.personalContactAndCaseInfo.postCode


  statisticsObj.client2Gender =getCapitalizedFirstLetter( MIAM1_C2.personalContactAndCaseInfo.gender)
  statisticsObj.client2Ethincity =getEthincityNumber(MIAM1_C2.personalContactAndCaseInfo.ethnicOrigin) 
  statisticsObj.client2Disability =creatDisabiltySymbols( MIAM1_C2.personalContactAndCaseInfo.disabilityRegistered)
  statisticsObj.client2LegallyAided =checkPrivateCase(currentCase.caseTypeC2) 


  statisticsObj.NoOfMediationSessions =getSessionNo(medsession.clientData.mediationSessionNumber) 
  statisticsObj.mediationTimePerMins = medsession.clientData.sessionLength;

  switch (medsession.NextSteps.mediationFinishedReason) {
    case "A - All/Some matters agreed": statisticsObj.outCome = "A";
      break;
    case "B - Mediation broken down/no longer suitable": statisticsObj.outCome = "B";
      break;
    case "C - Successful - Parenting plan to be written": statisticsObj.outCome = "C";
      break;
    case "P - Successful - MOU to be written": statisticsObj.outCome = "P";
      break;
    case "S - Successful - Most matters agreed and/or PP and/or MOU to be written": statisticsObj.outCome = "S";
      break;
    default: statisticsObj.outCome = ""
  }


  if (medsession.clientData.specifyLocation == "Online") {
    statisticsObj.outReachLocation = "000"
  }
  else {
    statisticsObj.outReachLocation = "001"
  }
  if (MIAM1_C1.personalContactAndCaseInfo.howClientFoundDMS == "Solicitor") {
    statisticsObj.referral = "008"
  } else {
    statisticsObj.referral = "002"
  }


  statisticsObj.VATindicator = "Y"
  statisticsObj.NetDisbursementAmountVAT = "undone"
  statisticsObj.DisbursementsVATamount = ""

  statisticsObj.client1PostalApplicationAccepted = "N"
  statisticsObj.client2PostalApplicationAccepted = "N"
  statisticsObj.scheduleReferenceOutCome = "2P664C/MEDI2018/00"
  

  return statisticsObj
}


module.exports = { MIAM2_Statistics_C1, MIAM2_Statistics_C2, MedSession_Statistics }



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

   ❤️❤️for miam , miam1.personalContactAndCaseInfo.howClientFoundDMS == "Solicitor" = > 008 else 002
   ❤️❤️ for medsession , miam1.personalContactAndCaseInfo.howClientFoundDMS == "Solicitor" = > 008 else 002

    referral:{type:String },  002 => comeFromCompany  , 008 => come from mediator

          


    VATindicator:{type:String },   => Y
    NetDisbursementAmountVAT:{type:String },  =>undone
    DisbursementsVATamount:{type:String },  => ""

    client1PostalApplicationAccepted:{type:String },  => N
    client2PostalApplicationAccepted:{type:String },  => N
    scheduleReferenceOutCome:{type:String },  =>   2P664C/MEDI2018/00

  }

  */
