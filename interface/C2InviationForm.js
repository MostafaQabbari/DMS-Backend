C2_Inviation={
C2Consent:"yes",
willingToMediation:" ",
firstName:"",
surName:"",
C2mail:" ",
otherPartyFirstName:" ",
otherPartySurName:" ",


privateOrLegailAid:" ",   
makeMediationLegalaidForTheFamilly:"yes",
specificBenefits:"",
entitledToLegalAid:"",
ConfirmationLegalAidIfEntitled:"",
phoneNumber:"",
timeToCallBack:""

}

{
    "InvitationAnswer": {
      "willingToComeToMediation": "",
      "firstName": "",
      "surname": "",
      "email": "",
      "otherPersonFirstName": "",
      "otherPersonSurname": "",
      "reasonsNotToCome": ""
    },
    "InvitationAccepted": {
      "privateOrLegal": "",
      "willingToMakeLegalAidApplication": "",
      "isReceiptOfAnyOfTheseSpecificBenefits": "",
      "isEntitledToLegalAid": "",
      "isStillLikeToMakeAnApplicationForLegalAid": "",
      "phone": ""
    },
    "phoneCallAppointment": ""
  }
  


{private :   // still need confirmation
     (InvitationAccepted.willingToComeToMediation === "No" ||
InvitationAccepted.privateOrLegal === "Private" ||
InvitationAccepted.isStillLikeToMakeAnApplicationForLegalAid === "No" )}
{ benefits:   // done
  (InvitationAccepted.privateOrLegal === "Legal Aid" &&
  InvitationAccepted.willingToMakeLegalAidApplication === "Yes" &&
  InvitationAccepted.isReceiptOfAnyOfTheseSpecificBenefits === "Yes"
  )
}
{ low income: //done
  (InvitationAccepted.privateOrLegal === "Legal Aid" &&
  InvitationAccepted.willingToMakeLegalAidApplication === "Yes" &&
  InvitationAccepted.isReceiptOfAnyOfTheseSpecificBenefits === "No" &&
  InvitationAccepted.isEntitledToLegalAid === "Yes" 
  )
}
{
  lsa mch 3arf:  // done
  (InvitationAccepted.privateOrLegal === "Legal Aid" &&
  InvitationAccepted.willingToMakeLegalAidApplication === "Yes" &&
  InvitationAccepted.isReceiptOfAnyOfTheseSpecificBenefits === "No" &&
  InvitationAccepted.isEntitledToLegalAid === "Yes" &&
  InvitationAccepted.isStillLikeToMakeAnApplicationForLegalAid === "Yes"
  ) 
}