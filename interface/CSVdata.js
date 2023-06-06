// module.exports = function CSVdata(data) {

//     return C1 = {

//         personalInfo: {
//             fullName: data["Full Name"],
//             firstName: data["First Name"],
//             surName: data["Surname"],
//             dateOfBirth: data["Date of Birth"],
//             phoneNumber: data["What is your telephone number?"],
//             email: data["Client Email Address"],
//             location: {
//                 houseNumberStreet: data["Street"],
//                 cityTown: data["City/Town"],
//                 postCode: data["Post Code"],
//                 country: data["Country"]
//             }
//         },
//         participantKnoworNot: {
//             answer: data["Other party knows my details"],
//             related: {
//                 needtoSureDetails: data["Do we need to keep your details confidential?"],
//             }
//         },

//         vulnerableAdult: data["Are You A Vulnerable Adult?"],
//         Disability: data["Are you registered disabled?"],
//         gender: data["Gender"],

//         willingMediationtoSortIssues: {
//             answer: data["Are you willing to try mediation to sort out your issues?"],
//             related: {
//                 shouldDoChangesToAttendMediation:
//                 {
//                     answer: data["Do we have to make any changes to our services to allow you to attend mediation?"],
//                     related: {
//                         WhatcanWedotoassist: data["What can we do to assist?"],
//                     }
//                 },
//                 willBringAnyoneToSupport:
//                 {
//                     answer: data["When you come to mediation, will you bring anyone for support?"],
//                     related: {
//                         fullNameOfSupportingPerson: data["Name of the supporting person you want to bring"],
//                     }
//                 }


//             }

//         },
//         nationality: {
//             enthnicOrigin: data["From the list, please select your ethnic origin."],
//             haveBritishNationalityorPassport: {
//                 answer: data["Do you have either British nationality/passport or Permanent Residency?"],
//                 related: {
//                     migrationDetailsToUK: data["UK Immigration status"]
//                 }
//             }

//         },
//         DMSreservationDetails: {
//             howFoundDMS: data["Can you tell me how you found out about Direct Mediation Services?"],
//             facingIssues: {
//                 answer: data["What are the issues that you are facing?"],
//                 relatedIfThereChildrenIssues: {
//                     childrens: [
//                         {
//                             child1: {
//                                 firstName: data["Name Child 1"],
//                                 surName: data["Surname Child 1"],
//                                 gender: data["Child 1 gender"],
//                                 livingWithWho: data["Child 1 living with?"],
//                                 DateOfBirth: data["Child 1 DoB"],
//                                 haveAnySpecialNeeds: {
//                                     answer: data["Child 1 has special needs?"],
//                                     related: {
//                                         whatSpecialNeeds: data["Child 1 special needs info"]
//                                     }
//                                 },
//                                 doYouHaveParentalResponsibility: data["Child 1 parental responsibility?"],
//                                 isThere2ndChild: data["Is there a 2nd child?"]
//                             },
//                         },
//                         {
//                             child2: {
//                                 firstName: data["Name Child 2"],
//                                 surName: data["Surname Child 2"],
//                                 gender: data["Child 2 gender"],
//                                 livingWithWho: data["Child 2 living with?"],
//                                 DateOfBirth: data["Child 2 DoB"],
//                                 haveAnySpecialNeeds: {
//                                     answer: data["Child 2 has special needs?"],
//                                     related: {
//                                         whatSpecialNeeds: data["Child 2 special needs info"]
//                                     }
//                                 },
//                                 doYouHaveParentalResponsibility: data["Child 2 parental responsibility?"],
//                                 isThere3rdChild: data["Is there a 3rd child?"]
//                             },
//                         },
//                         {
//                             child3: {
//                                 firstName: data["Name Child 3"],
//                                 surName: data["Surname Child 3"],
//                                 gender: data["Child 3 gender"],
//                                 livingWithWho: data["Child 3 living with?"],
//                                 DateOfBirth: data["Child 3 DoB"],
//                                 haveAnySpecialNeeds: {
//                                     answer: data["Child 3 has special needs?"],
//                                     related: {
//                                         whatSpecialNeeds: data["Child 3 special needs info"]
//                                     }
//                                 },
//                                 doYouHaveParentalResponsibility: data["Child 3 parental responsibility?"],
//                                 isThere4thChild: data["Is there a 4th child?"]
//                             },
//                         },
//                         {
//                             child4: {
//                                 firstName: data["Name Child 4"],
//                                 surName: data["Surname Child 4"],
//                                 gender: data["Child 4 gender"],
//                                 livingWithWho: data["Child 4 living with?"],
//                                 DateOfBirth: data["Child 4 DoB"],
//                                 haveAnySpecialNeeds: {
//                                     answer: data["Child 4 has special needs?"],
//                                     related: {
//                                         whatSpecialNeeds: data["Child 4 special needs info"]
//                                     }
//                                 },
//                                 doYouHaveParentalResponsibility: data["Child 4 parental responsibility?"],
//                                 isThere5thChild: data["Is there a 5th child?"]
//                             },
//                         },
//                         {
//                             child5: {
//                                 firstName: data["Name Child 5"],
//                                 surName: data["Surname Child 5"],
//                                 gender: data["Child 5 gender"],
//                                 livingWithWho: data["Child 5 living with?"],
//                                 DateOfBirth: data["Child 5 DoB"],
//                                 haveAnySpecialNeeds: {
//                                     answer: data["Child 5 has special needs?"],
//                                     related: {
//                                         whatSpecialNeeds: data["Child 5 special needs info"]
//                                     }
//                                 },
//                                 doYouHaveParentalResponsibility: data["Child 5 parental responsibility?"],
//                                 isThere6thChild: data["Is there a 6th child?"]
//                             },

//                         },
//                         {
//                             child6: {
//                                 firstName: data["Name Child 6"],
//                                 surName: data["Surname Child 6"],
//                                 gender: data["Child 6 gender"],
//                                 livingWithWho: data["Child 6 living with?"],
//                                 DateOfBirth: data["Child 6 DoB"],
//                                 haveAnySpecialNeeds: {
//                                     answer: data["Child 6 has special needs?"],
//                                     related: {
//                                         whatSpecialNeeds: data["Child 6 special needs info"]
//                                     }
//                                 },
//                                 doYouHaveParentalResponsibility: data["Child 6 parental responsibility?"],

//                             },
//                         },
//                     ],
//                 }
//             },

//         },
//         ifThereanyDayscantMake: {
//             answer: data["Dates you cannot attend?"],
//             related: {
//                 datesCantAttendMediation: data["Dates not attending"],
//             }
//         },
//         whenWouldLikeAppointmentTime: data["when would you like your appointment?"],
//         Client2Details: {

//             whoIsinTheConflict: data["Please tell us who is the other party in the conflict."],
//             FirstName: data["What is the other party's first name?"],
//             SurName: data[],
//            // BirthDate: data,
//             Email: data["What is your ex-partner's email address?"],
//             PhoneNumber: data["What is your ex-partner's phone number?"],
//             DoYouKnowhisaddress: {
//                 answer: data["Do you know the other party's home address?"],
//                 related: {
//                     houseNumberandStreet: data["What is your ex-partner's address? - Street"],
//                     cityandTown: data["What is your ex-partner's address? - City/Suburb"],
//                    // country: data,
//                     postCode: data["What is your ex-partner's address? - Zip/Post Code"],
//                 }

//             }
//         },
//         ExPartnerDetails: {
//             separationDate: data["When did you separate from your ex-partner?"],
//             relationDuration: data["How long were you in a relationship with your ex-partner?"],
//             wereMarried: {
//                 answer: data["Were you married or in a civil partnership to your ex-partner?"],
//                 related: {
//                     marriageDate: data["What was the date of your marriage/civil partnership?"]
//                 }
//             }

//         },
//         CourtProceedings: {
//             awareofanylegalproceedings: {
//                 answer: data["Any legal proceedings?"],
//                 related: { awarnessInformation: data["Info about legal proceedings"] }
//             },

//             knowcourtapplicationshavebeenmade:
//             {
//                 answer: data["Court applications made?"],
//                 related: {
//                     DetailsAboutCourtsandDates: data["Court proceedings info"]
//                 }
//             },
//         },
//         MartialStatus: data["What is your marital status?"],
//         SolicitororMcKenziefriendsdetails: {
//             answer: {
//                 haveOrnot: data["Do you have a solicitor?"],
//             },
//             related: {
//                 Names: data["Solicitor's name"],
//                 nameOfTheLawFirm: data["Name of the law firm?"],
//                 PhoneNumbers: data["Law firm telephone?"],
//                 PhoneEmails: data["Law firm's email?"],

//             }
//         },
//         WantCertificateToSentToThem: data["Court form to be sent to the solicitor?"],
//         FreeConsultaionRegardingLegalSupport: data["Free consultation?"],
//         ClientCareLetter: {
//             confirmReadingLetter: data["I have read my client care letter"],
//             confirmwatchingMIAMvideo: data[ "I have watched the MIAM video"],

//         }






//     }


// }

module.exports = function airTableData(data) {

    return {
        MIAM1: {

            personalContactAndCaseInfo: {
                fullName: data["Full Name"],
                firstName: data["First Name"],
                surName: data["Surname"],
                dateOfBirth: data["Date of Birth"],
                phoneNumber: data["What is your telephone number?"],
                email: data["Client Email Address"],

                street: data["Street"],
                city: data["City/Town"],
                postCode: data["Post Code"],
                country: data["Country"],
                doesOtherPartyKnow: data["Other party knows my details"],
                makeDetailsConfidential: data["Do we need to keep your details confidential?"],



                isClientVulnerable: data["Are You A Vulnerable Adult?"],
                disabilityRegistered: data["Are you registered disabled?"],
                gender: data["Gender"],


                isWillingToTryMediation: data["Are you willing to try mediation to sort out your issues?"],



                areChangesToServicesRequired: data["Do we have to make any changes to our services to allow you to attend mediation?"],

                changesRequired: data["What can we do to assist?"],



                willSupporterAttendMediation: data["When you come to mediation, will you bring anyone for support?"],

                supporterNameAndRelation: data["Name of the supporting person you want to bring"],


                ethnicOrigin: data["From the list, please select your ethnic origin."],

                hasBritishPassport: data["Do you have either British nationality/passport or Permanent Residency?"],

                immigrationStatus: data["UK Immigration status"],

                howClientFoundDMS: data["Can you tell me how you found out about Direct Mediation Services?"],

                facedIssue: data["What are the issues that you are facing?"],
                isThereDaysCanNotAttend: data["Dates you cannot attend?"],

                whatDaysCanNotAttend: data["Dates not attending"],

                appointmentTime: data["when would you like your appointment?"],
                otherParty: data["Please tell us who is the other party in the conflict."]
            },
            otherParty: {
                otherPartyFirstName: data["What is the other party's first name?"],
                otherPartySurname: data["What is the other party's surname/family name?"],
                otherPartyDateOfBirth: data,
                otherPartyEmail: data["What is your ex-partner's email address?"],
                otherPartyPhone: data["What is your ex-partner's phone number?"],
                otherPartyAddressKnown: data["Do you know the other party's home address?"],

                otherPartyStreet: data["What is your ex-partner's address? - Street"],
                otherPartyCity: data["What is your ex-partner's address? - City/Suburb"],
                otherPartyCountry: data["Country"],
                otherPartyPostalCode: data["What is your ex-partner's address? - Zip/Post Code"],
            },
            previousRelationshipDetails: {
                separationDate: data["When did you separate from your ex-partner?"],
                relationshipPeriod: data["How long were you in a relationship with your ex-partner?"],

                isMarried: data["Were you married or in a civil partnership to your ex-partner?"],

                marriageDate: data["What was the date of your marriage/civil partnership?"]
            },
            children: {
                childOne: {
                    childFirstName: data["Name Child 1"],
                    childSurName: data["Surname Child 1"],
                    childGender: data["Child 1 gender"],
                    childLivingWith: data["Child 1 living with?"],
                    childDateOfBirth: data["Child 1 DoB"],
                    isChildHaveSpecialNeeds: data["Child 1 has special needs?"],
                    childSpecialNeeds: data["Child 1 special needs info"],
                    childResponsibility: data["Child 1 parental responsibility?"],
                    secondChildCheck: data["Is there a 2nd child?"]
                },


                childTwo: {
                    childFirstName: data["Name Child 2"],
                    childSurName: data["Surname Child 2"],
                    childGender: data["Child 2 gender"],
                    childLivingWith: data["Child 2 living with?"],
                    childDateOfBirth: data["Child 2 DoB"],

                    isChildHaveSpecialNeeds: data["Child 2 has special needs?"],

                    childSpecialNeeds: data["Child 2 special needs info"],

                    childResponsibility: data["Child 2 parental responsibility?"],
                    thirdChildCheck: data["Is there a 3rd child?"]
                },

                childThree: {
                    childFirstName: data["Name Child 3"],
                    childSurName: data["Surname Child 3"],
                    childGender: data["Child 3 gender"],
                    childLivingWith: data["Child 3 living with?"],
                    childDateOfBirth: data["Child 3 DoB"],

                    isChildHaveSpecialNeeds: data["Child 3 has special needs?"],

                    childSpecialNeeds: data["Child 3 special needs info"],

                    childResponsibility: data["Child 3 parental responsibility?"],
                    fourthChildCheck: data["Is there a 4th child?"]
                },

                childFour: {
                    childFirstName: data["Name Child 4"],
                    childSurName: data["Surname Child 4"],
                    childGender: data["Child 4 gender"],
                    childLivingWith: data["Child 4 living with?"],
                    childDateOfBirth: data["Child 4 DoB"],

                    isChildHaveSpecialNeeds: data["Child 4 has special needs?"],

                    childSpecialNeeds: data["Child 4 special needs info"],


                    childResponsibility: data["Child 4 parental responsibility?"],
                    fifthChildCheck: data["Is there a 5th child?"]
                },

                child5: {
                    childFirstName: data["Name Child 5"],
                    childSurName: data["Surname Child 5"],
                    childGender: data["Child 5 gender"],
                    childLivingWith: data["Child 5 living with?"],
                    childDateOfBirth: data["Child 5 DoB"],

                    isChildHaveSpecialNeeds: data["Child 5 has special needs?"],

                    childSpecialNeeds: data["Child 5 special needs info"],

                    childResponsibility: data["Child 5 parental responsibility?"],
                    sixthChildCheck: data["Is there a 6th child?"]
                },


                childSix: {
                    childFirstName: data["Name Child 6"],
                    childSurName: data["Surname Child 6"],
                    childGender: data["Child 6 gender"],
                    childLivingWith: data["Child 6 living with?"],
                    childDateOfBirth: data["Child 6 DoB"],

                    isChildHaveSpecialNeeds: data["Child 6 has special needs?"],

                    childSpecialNeeds: data["Child 6 special needs info"],

                    childResponsibility: data["Child 6 parental responsibility?"],

                },
            },
            courtProceedings: {

                isFacingLegalProceedings: data["Any legal proceedings?"],
                legalProceedingsInfo: data["Info about legal proceedings"],


                courtApplicationKnown: data["Court applications made?"],

                courtApplicationInfo: data["Court proceedings info"],

                maritalStatus: data["What is your marital status?"],
            },
            yourSolicitorOrMcKenzieFriend: {
                solicitorCheck: data["Do you have a solicitor?"],
                solicitorName: data["Solicitor's name"],
                solicitorLawFirmName: data["Name of the law firm?"],
                solicitorTelephone: data["Law firm telephone?"],
                solicitorEmail: data["Law firm's email?"],
                sendMediationCertificateToSolicitor: data["Court form to be sent to the solicitor?"],
                consultationRegardingLegalSupport: data["Free consultation?"],
            }
        },

            MIAM2: [{

                mediatorData: {
                    mediatorName: data["Name of Mediator"],
                    mediatorEmail: data["Email (from Name of Mediator)"],
                },
                MIAMdetails: {
                    date: data["Date of MIAM"],
                    location: data["MIAM Location"],
                    MIAMforC1orC2: data["Client 1 or 2?"]

                },
                client1Data: {
                    firstName: data['First Name'],
                    surName: data['Surname'],
                    email: data["Client Email Address"],
                    surNameofC2: data["What is the other party's surname/family name?"]
                },
                caseLegalorPrivate:
                {
                    answer: data["Is the client private or legal aid?"],
                    relatedifPrivate: {
                        paymentHasBeenMade: {
                            answer: data["Has Payment Been Done for This Appointment"],
                            reasonOfWhydidnotMade: data["Reason Why Payment Not Done"]

                        },
                        paymentAdvancedExplained: data["Payment in advance explained?"]
                    }
                },
                MediationCommentsANDsafeguarding: {
                    commentsFromMediator: data["Comments from the mediator"],
                    DomesticAbuseORviolence: {
                        answer: data["Domestic abuse or violence?"],
                        RelatedifYes: {
                            detailsForAbuseOrViolence: data["Please provide details for abuse or violence"]
                        }
                    },
                    policeInvolvement: {
                        answer: data["Any police involvement?"],
                        RelatedifYes: {
                            detailsOfIncidentsInvolving: data["Please provide details of any incidents involving the police."]
                        }
                    },
                    socialServicesInvolvement: {
                        answer: data["Any Social Services involvement?"],
                        RelatedifYes: {
                            detailsOfsocialServicesInvolvement: data["Please provide details of the  Social Services Department involvement?"]
                        }
                    },
                    safeguardingIssues: {
                        answer: data["Are there any safeguarding issues such as drugs or alcohol?"],
                        RelatedifYes: {
                            detailsOfsafeguardingIssues: data["Please provide details of the safeguarding issues"]
                        }
                    },
                    AreThereAnyCourtOrders: {
                        answer: data["Any court orders in place?"],
                        RelatedifYes: {
                            detailsOfCourtOrders: data["Court order details"]
                        }
                    },
                    clientRequireSignposting: {
                        answer: data["Signposting required?"],
                        RelatedifYes: {
                            whichOrgnizationsSignpostTheClient: data["Where did the mediator signposted?"]
                        }
                    },


                },
                typeOfMediation: {

                    clientWillingToGoAhead: {
                        answer: data["Is the client willing to go ahead with mediation?"],
                        RelatedifYes: {
                            wichFormOfMediation: data["Preferred Form of Mediation"]
                        },
                        RelatedifNo: {
                            ReasonsForRefusal: data["Reasons for refusal (Child Inclusive Mediation)"]
                        }
                    },
                    ConfirmLegalDispute: {
                        answer: data["Legal Dispute"],
                        ifThereChildarrangment: {
                            isChildInclusiveMediationAppropriate: {

                                answer: data['not found in airtable'],
                                ifYes: {
                                    DoesClientWishForChildInclusiveMediation: data['not found in airtable']
                                }

                            }

                        },
                        HasADRinformationGivenToTheClient: {
                            answer: data["ADR"],
                            ifNo: {
                                WhyADRwasnotProvided: data["ADR not provided"]
                            }

                        }

                    }

                },
                finalCommentsFromMediator: {
                    IsTheCaseSuitableForMediation: {
                        answer: data["Is the case suitable for mediation?"],
                        ifNo: {
                            whyNotSuitable: data["Why Case not suitable for mediation"]
                        }
                    },
                    NeedToUploadCourtForm: {
                        answer: data["Upload Court Forms?"],
                        related: {
                            c100Bath: data["C100"],
                            FormA: data["FormA"],

                        }

                    },
                    commentstoDMSadmin: data["Any comments to DMS admin team?"]
                }




            }]
        }


    }






