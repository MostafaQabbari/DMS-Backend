 client1data = [{
 
        personalInfo: {
            firstName: { type: String },
            surName: { type: String },
            dateOfBirth: { type: Date },
            phoneNumber: { type: String },
            email: { type: String },
            location: {
                houseNumberStreet: { type: String },
                cityTown: { type: String },
                postCode: { type: String },
                country: { type: String },

            },
            participantKnoworNot:
            {
                answer: { type: String },
                related: {
                    needtoSureDetails: { type: String },
                }

            },
            vulnerableAdult: { type: String },
            Disability: [String],
            gender: { type: String },

        },
        willingMediationtoSortIssues: {
            answer: { type: String },
            related: {
                shouldDoChangesToAttendMediation:
                {
                    answer: { type: String },
                    related: {
                        WhatcanWedotoassist: { type: String },
                    }
                },


                willBringAnyoneToSupport:
                {
                    answer: { type: String },
                    related: {
                        fullNameOfSupportingPerson: { type: String },
                    }
                }


            }

        },
        nationality: {
            enthnicOrigin: { type: String },
            haveBritishNationalityorPassport: {
                answer: { type: String },
                related: {
                    migrationDetailsToUK: { type: String }
                }
            }


        },
        DMSreservationDetails: {
            howFoundDMS: { type: String },
            facingIssues: {
                answer: { type: String },
                relatedIfThereChildrenIssues: {
                    childrens: [
                        {
                            child1: {
                                firstName: { type: String },
                                surName: { type: String },
                                gender: { type: String },
                                livingWithWho: { type: String },
                                DateOfBirth: { type: Date },
                                haveAnySpecialNeeds: {
                                    answer: { type: String },
                                    related: {
                                        whatSpecialNeeds: { type: String }
                                    }
                                },
                                doYouHaveParentalResponsibility: { type: String },
                                isThere2ndChild: { type: String }
                            },
                        },
                        {
                            child2: {
                                firstName: { type: String },
                                surName: { type: String },
                                gender: { type: String },
                                livingWithWho: { type: String },
                                DateOfBirth: { type: Date },
                                haveAnySpecialNeeds: {
                                    answer: { type: String },
                                    related: {
                                        whatSpecialNeeds: { type: String }
                                    }
                                },
                                doYouHaveParentalResponsibility: { type: String },
                                isThere3rdChild: { type: String }
                            },
                        },
                        {
                            child3: {
                                firstName: { type: String },
                                surName: { type: String },
                                gender: { type: String },
                                livingWithWho: { type: String },
                                DateOfBirth: { type: Date },
                                haveAnySpecialNeeds: {
                                    answer: { type: String },
                                    related: {
                                        whatSpecialNeeds: { type: String }
                                    }
                                },
                                doYouHaveParentalResponsibility: { type: String },
                                isThere4thChild: { type: String }
                            },
                        },
                        {
                            child4: {
                                firstName: { type: String },
                                surName: { type: String },
                                gender: { type: String },
                                livingWithWho: { type: String },
                                DateOfBirth: { type: Date },
                                haveAnySpecialNeeds: {
                                    answer: { type: String },
                                    related: {
                                        whatSpecialNeeds: { type: String }
                                    }
                                },
                                doYouHaveParentalResponsibility: { type: String },
                                isThere5thChild: { type: String }
                            },
                        },
                        {
                            child5: {
                                firstName: { type: String },
                                surName: { type: String },
                                gender: { type: String },
                                livingWithWho: { type: String },
                                DateOfBirth: { type: Date },
                                haveAnySpecialNeeds: {
                                    answer: { type: String },
                                    related: {
                                        whatSpecialNeeds: { type: String }
                                    }
                                },
                                doYouHaveParentalResponsibility: { type: String },
                                isThere6thChild: { type: String }
                            },
            
                        },
                        {
                            child6: {
                                firstName: { type: String },
                                surName: { type: String },
                                gender: { type: String },
                                livingWithWho: { type: String },
                                DateOfBirth: { type: Date },
                                haveAnySpecialNeeds: {
                                    answer: { type: String },
                                    related: {
                                        whatSpecialNeeds: { type: String }
                                    }
                                },
                                doYouHaveParentalResponsibility: { type: String },
            
                            },
                        },
                    ],
                }
            },
            ifThereanyDayscantMake: {
                answer: { type: String },
                related: {
                    datesCantAttendMediation: { type: String },
                }
            },

            whenWouldLikeAppointmentTime: { type: String },
        },
        Client2Details: {

            whoIsinTheConflict: { type: String },
            FirstName: { type: String },
            SurName: { type: String },
            BirthDate: { type: Date },
            Email: { type: String },
            PhoneNumber: { type: String },
            DoYouKnowhisaddress: {
                answer: { type: String },
                related: {
                    houseNumberandStreet: { type: String },
                    cityandTown: { type: String },
                    country: { type: String },
                    postCode: { type: String },
                }

            }
        },
        ExPartnerDetails: {
            separationDate: { type: String },
            relationDuration: { type: String },
            wereMarried: {
                answer: { type: String },
                related: {
                    marriageDate: { type: String }
                }
            }

        },
     

        CourtProceedings: { // 
            awareofanylegalproceedings: {
                answer: { type: String },
                related: { awarnessInformation: { type: String }, }
            },

            knowcourtapplicationshavebeenmade:
            {
                answer: { type: String },
                related: {
                    DetailsAboutCourtsandDates: { type: String }
                }
            },
        },

        MartialStatus: { type: String },
        SolicitororMcKenziefriendsdetails: {
            answer: { 
                haveOrnot: { type: String }, },
            related: {
                Names: { type: String },
                nameOfTheLawFirm: { type: String },
                PhoneNumbers: { type: String },
                PhoneEmails: { type: String },

            }
        },
        WantCertificateToSentToThem: { type: String },
        FreeConsultaionRegardingLegalSupport: { type: String },
        ClientCareLetter: {
            confirmReadingLetter: { type: String },
            confirmwatchingMIAMvideo: { type: String },

        }


    }
]