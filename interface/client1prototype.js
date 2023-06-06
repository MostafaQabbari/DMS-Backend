 client1data ={
    "personalContactAndCaseInfo": {
      "firstName": "John",
      "surName": "Doe",
      "dateOfBirth": "12/5/2012",
      "phoneNumber": "54210542",
      "email": "john@email.com",
      "street": "Mountain",
      "city": "Giza",
      "postCode": "123",
      "country": "egypt",
      "doesOtherPartyKnow": "Yes",
      "makeDetailsConfidential": "Yes",
      "isClientVulnerable": "Yes",
      "disabilityRegistered": [""],
      "gender": "Female",
      "isWillingToTryMediation": "Yes",
      "areChangesToServicesRequired": "Yes",
      "changesRequired": "changesRequired",
      "willSupporterAttendMediation": "Yes",
      "supporterNameAndRelation": "Jane Doe",
      "ethnicOrigin": "White",
      "hasBritishPassport": "No",
      "immigrationStatus": "immigrant",
      "howClientFoundDMS": "Google",
      "facedIssue": "children",
      "isThereDaysCanNotAttend": "Yes",
      "whatDaysCanNotAttend": "Yes",
      "appointmentTime": "Mornings",
      "otherParty": "Ex-partner"
    },
    "otherParty": {
      "otherPartyFirstName": "",
      "otherPartySurname": "",
      "otherPartyDateOfBirth": "",
      "otherPartyEmail": "",
      "otherPartyPhone": "",
      "otherPartyAddressKnown": "",
      "otherPartyStreet": "",
      "otherPartyCity": "",
      "otherPartyCountry": "",
      "otherPartyPostalCode": ""
    },
    "previousRelationshipDetails": {
      "separationDate": "",
      "relationshipPeriod": "",
      "isMarried": "",
      "marriageDate": ""
    },
    "children": {
      "childOne": {
        "childFirstName": "",
        "childSurName": "",
        "childGender": "",
        "childLivingWith": "",
        "childDateOfBirth": "",
        "isChildHaveSpecialNeeds": "",
        "childSpecialNeeds": "",
        "secondChildCheck": ""
      },
      "childTwo": {
        "childFirstName": "",
        "childSurName": "",
        "childGender": "",
        "childLivingWith": "",
        "childDateOfBirth": "",
        "isChildHaveSpecialNeeds": "",
        "childSpecialNeeds": "",
        "thirdChildCheck": ""
      },
      "childThree": {
        "childFirstName": "",
        "childSurName": "",
        "childGender": "",
        "childLivingWith": "",
        "childDateOfBirth": "",
        "isChildHaveSpecialNeeds": "",
        "childSpecialNeeds": "",
        "fourthChildCheck": ""
      },
      "childFour": {
        "childFirstName": "",
        "childSurName": "",
        "childGender": "",
        "childLivingWith": "",
        "childDateOfBirth": "",
        "isChildHaveSpecialNeeds": "",
        "childSpecialNeeds": "",
        "fifthChildCheck": ""
      },
      "childFive": {
        "childFirstName": "",
        "childSurName": "",
        "childGender": "",
        "childLivingWith": "",
        "childDateOfBirth": "",
        "isChildHaveSpecialNeeds": "",
        "childSpecialNeeds": "",
        "sixthChildCheck": ""
      },
      "childSix": {
        "childFirstName": "",
        "childSurName": "",
        "childGender": "",
        "childLivingWith": "",
        "childDateOfBirth": "",
        "isChildHaveSpecialNeeds": "",
        "childSpecialNeeds": ""
      }
    },
    "courtProceedings": {
      "isFacingLegalProceedings": "",
      "legalProceedingsInfo": "",
      "courtApplicationKnown": "",
      "courtApplicationInfo": "",
      "maritalStatus": ""
    },
    "yourSolicitorOrMcKenzieFriend": {
      "solicitorCheck": "",
      "solicitorName": "John",
      "solicitorLawFirmName": "John",
      "solicitorTelephone": "",
      "solicitorEmail": "",
      "sendMediationCertificateToSolicitor": "",
      "consultationRegardingLegalSupport": ""
    }
  }
  
 
 
 
//  [{
 
//         personalInfo: {
//             firstName: { type: String },
//             surName: { type: String },
//             dateOfBirth: { type: Date },
//             phoneNumber: { type: String },
//             email: { type: String },
//             location: {
//                 houseNumberStreet: { type: String },
//                 cityTown: { type: String },
//                 postCode: { type: String },
//                 country: { type: String },

//             },
//             participantKnoworNot:
//             {
//                 answer: { type: String },
//                 related: {
//                     needtoSureDetails: { type: String },
//                 }

//             },
//             vulnerableAdult: { type: String },
//             Disability: [String],
//             gender: { type: String },

//         },
//         willingMediationtoSortIssues: {
//             answer: { type: String },
//             related: {
//                 shouldDoChangesToAttendMediation:
//                 {
//                     answer: { type: String },
//                     related: {
//                         WhatcanWedotoassist: { type: String },
//                     }
//                 },


//                 willBringAnyoneToSupport:
//                 {
//                     answer: { type: String },
//                     related: {
//                         fullNameOfSupportingPerson: { type: String },
//                     }
//                 }


//             }

//         },
//         nationality: {
//             enthnicOrigin: { type: String },
//             haveBritishNationalityorPassport: {
//                 answer: { type: String },
//                 related: {
//                     migrationDetailsToUK: { type: String }
//                 }
//             }


//         },
//         DMSreservationDetails: {
//             howFoundDMS: { type: String },
//             facingIssues: {
//                 answer: { type: String },
//                 relatedIfThereChildrenIssues: {
//                     childrens: [
//                         {
//                             child1: {
//                                 firstName: { type: String },
//                                 surName: { type: String },
//                                 gender: { type: String },
//                                 livingWithWho: { type: String },
//                                 DateOfBirth: { type: Date },
//                                 haveAnySpecialNeeds: {
//                                     answer: { type: String },
//                                     related: {
//                                         whatSpecialNeeds: { type: String }
//                                     }
//                                 },
//                                 doYouHaveParentalResponsibility: { type: String },
//                                 isThere2ndChild: { type: String }
//                             },
//                         },
//                         {
//                             child2: {
//                                 firstName: { type: String },
//                                 surName: { type: String },
//                                 gender: { type: String },
//                                 livingWithWho: { type: String },
//                                 DateOfBirth: { type: Date },
//                                 haveAnySpecialNeeds: {
//                                     answer: { type: String },
//                                     related: {
//                                         whatSpecialNeeds: { type: String }
//                                     }
//                                 },
//                                 doYouHaveParentalResponsibility: { type: String },
//                                 isThere3rdChild: { type: String }
//                             },
//                         },
//                         {
//                             child3: {
//                                 firstName: { type: String },
//                                 surName: { type: String },
//                                 gender: { type: String },
//                                 livingWithWho: { type: String },
//                                 DateOfBirth: { type: Date },
//                                 haveAnySpecialNeeds: {
//                                     answer: { type: String },
//                                     related: {
//                                         whatSpecialNeeds: { type: String }
//                                     }
//                                 },
//                                 doYouHaveParentalResponsibility: { type: String },
//                                 isThere4thChild: { type: String }
//                             },
//                         },
//                         {
//                             child4: {
//                                 firstName: { type: String },
//                                 surName: { type: String },
//                                 gender: { type: String },
//                                 livingWithWho: { type: String },
//                                 DateOfBirth: { type: Date },
//                                 haveAnySpecialNeeds: {
//                                     answer: { type: String },
//                                     related: {
//                                         whatSpecialNeeds: { type: String }
//                                     }
//                                 },
//                                 doYouHaveParentalResponsibility: { type: String },
//                                 isThere5thChild: { type: String }
//                             },
//                         },
//                         {
//                             child5: {
//                                 firstName: { type: String },
//                                 surName: { type: String },
//                                 gender: { type: String },
//                                 livingWithWho: { type: String },
//                                 DateOfBirth: { type: Date },
//                                 haveAnySpecialNeeds: {
//                                     answer: { type: String },
//                                     related: {
//                                         whatSpecialNeeds: { type: String }
//                                     }
//                                 },
//                                 doYouHaveParentalResponsibility: { type: String },
//                                 isThere6thChild: { type: String }
//                             },
            
//                         },
//                         {
//                             child6: {
//                                 firstName: { type: String },
//                                 surName: { type: String },
//                                 gender: { type: String },
//                                 livingWithWho: { type: String },
//                                 DateOfBirth: { type: Date },
//                                 haveAnySpecialNeeds: {
//                                     answer: { type: String },
//                                     related: {
//                                         whatSpecialNeeds: { type: String }
//                                     }
//                                 },
//                                 doYouHaveParentalResponsibility: { type: String },
            
//                             },
//                         },
//                     ],
//                 }
//             },
//             ifThereanyDayscantMake: {
//                 answer: { type: String },
//                 related: {
//                     datesCantAttendMediation: { type: String },
//                 }
//             },

//             whenWouldLikeAppointmentTime: { type: String },
//         },
//         Client2Details: {

//             whoIsinTheConflict: { type: String },
//             FirstName: { type: String },
//             SurName: { type: String },
//             BirthDate: { type: Date },
//             Email: { type: String },
//             PhoneNumber: { type: String },
//             DoYouKnowhisaddress: {
//                 answer: { type: String },
//                 related: {
//                     houseNumberandStreet: { type: String },
//                     cityandTown: { type: String },
//                     country: { type: String },
//                     postCode: { type: String },
//                 }

//             }
//         },
//         ExPartnerDetails: {
//             separationDate: { type: String },
//             relationDuration: { type: String },
//             wereMarried: {
//                 answer: { type: String },
//                 related: {
//                     marriageDate: { type: String }
//                 }
//             }

//         },
     

//         CourtProceedings: { // 
//             awareofanylegalproceedings: {
//                 answer: { type: String },
//                 related: { awarnessInformation: { type: String }, }
//             },

//             knowcourtapplicationshavebeenmade:
//             {
//                 answer: { type: String },
//                 related: {
//                     DetailsAboutCourtsandDates: { type: String }
//                 }
//             },
//         },

//         MartialStatus: { type: String },
//         SolicitororMcKenziefriendsdetails: {
//             answer: { 
//                 haveOrnot: { type: String }, },
//             related: {
//                 Names: { type: String },
//                 nameOfTheLawFirm: { type: String },
//                 PhoneNumbers: { type: String },
//                 PhoneEmails: { type: String },

//             }
//         },
//         WantCertificateToSentToThem: { type: String },
//         FreeConsultaionRegardingLegalSupport: { type: String },
//         ClientCareLetter: {
//             confirmReadingLetter: { type: String },
//             confirmwatchingMIAMvideo: { type: String },

//         }


//     }
// ]