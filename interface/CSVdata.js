module.exports = function CSVdata(data) {

    return C1 = {

        personalInfo: {
            fullName: data["Full Name"],
            firstName: data["First Name"],
            surName: data["Surname"],
            dateOfBirth: data["Date of Birth"],
            phoneNumber: data["What is your telephone number?"],
            email: data["Client Email Address"],
            location: {
                houseNumberStreet: data["Street"],
                cityTown: data["City/Town"],
                postCode: data["Post Code"],
                country: data["Country"]
            }
        },
        participantKnoworNot: {
            answer: data["Other party knows my details"],
            related: {
                needtoSureDetails: data["Do we need to keep your details confidential?"],
            }
        },

        vulnerableAdult: data["Are You A Vulnerable Adult?"],
        Disability: data["Are you registered disabled?"],
        gender: data["Gender"],

        willingMediationtoSortIssues: {
            answer: data["Are you willing to try mediation to sort out your issues?"],
            related: {
                shouldDoChangesToAttendMediation:
                {
                    answer: data["Do we have to make any changes to our services to allow you to attend mediation?"],
                    related: {
                        WhatcanWedotoassist: data["What can we do to assist?"],
                    }
                },
                willBringAnyoneToSupport:
                {
                    answer: data["When you come to mediation, will you bring anyone for support?"],
                    related: {
                        fullNameOfSupportingPerson: data["Name of the supporting person you want to bring"],
                    }
                }


            }

        },
        nationality: {
            enthnicOrigin: data["From the list, please select your ethnic origin."],
            haveBritishNationalityorPassport: {
                answer: data["Do you have either British nationality/passport or Permanent Residency?"],
                related: {
                    migrationDetailsToUK: data["UK Immigration status"]
                }
            }

        },
        DMSreservationDetails: {
            howFoundDMS: data["Can you tell me how you found out about Direct Mediation Services?"],
            facingIssues: {
                answer: data["What are the issues that you are facing?"],
                relatedIfThereChildrenIssues: {
                    childrens: [
                        {
                            child1: {
                                firstName: data["Name Child 1"],
                                surName: data["Surname Child 1"],
                                gender: data["Child 1 gender"],
                                livingWithWho: data["Child 1 living with?"],
                                DateOfBirth: data["Child 1 DoB"],
                                haveAnySpecialNeeds: {
                                    answer: data["Child 1 has special needs?"],
                                    related: {
                                        whatSpecialNeeds: data["Child 1 special needs info"]
                                    }
                                },
                                doYouHaveParentalResponsibility: data["Child 1 parental responsibility?"],
                                isThere2ndChild: data["Is there a 2nd child?"]
                            },
                        },
                        {
                            child2: {
                                firstName: data["Name Child 2"],
                                surName: data["Surname Child 2"],
                                gender: data["Child 2 gender"],
                                livingWithWho: data["Child 2 living with?"],
                                DateOfBirth: data["Child 2 DoB"],
                                haveAnySpecialNeeds: {
                                    answer: data["Child 2 has special needs?"],
                                    related: {
                                        whatSpecialNeeds: data["Child 2 special needs info"]
                                    }
                                },
                                doYouHaveParentalResponsibility: data["Child 2 parental responsibility?"],
                                isThere3rdChild: data["Is there a 3rd child?"]
                            },
                        },
                        {
                            child3: {
                                firstName: data["Name Child 3"],
                                surName: data["Surname Child 3"],
                                gender: data["Child 3 gender"],
                                livingWithWho: data["Child 3 living with?"],
                                DateOfBirth: data["Child 3 DoB"],
                                haveAnySpecialNeeds: {
                                    answer: data["Child 3 has special needs?"],
                                    related: {
                                        whatSpecialNeeds: data["Child 3 special needs info"]
                                    }
                                },
                                doYouHaveParentalResponsibility: data["Child 3 parental responsibility?"],
                                isThere4thChild: data["Is there a 4th child?"]
                            },
                        },
                        {
                            child4: {
                                firstName: data["Name Child 4"],
                                surName: data["Surname Child 4"],
                                gender: data["Child 4 gender"],
                                livingWithWho: data["Child 4 living with?"],
                                DateOfBirth: data["Child 4 DoB"],
                                haveAnySpecialNeeds: {
                                    answer: data["Child 4 has special needs?"],
                                    related: {
                                        whatSpecialNeeds: data["Child 4 special needs info"]
                                    }
                                },
                                doYouHaveParentalResponsibility: data["Child 4 parental responsibility?"],
                                isThere5thChild: data["Is there a 5th child?"]
                            },
                        },
                        {
                            child5: {
                                firstName: data["Name Child 5"],
                                surName: data["Surname Child 5"],
                                gender: data["Child 5 gender"],
                                livingWithWho: data["Child 5 living with?"],
                                DateOfBirth: data["Child 5 DoB"],
                                haveAnySpecialNeeds: {
                                    answer: data["Child 5 has special needs?"],
                                    related: {
                                        whatSpecialNeeds: data["Child 5 special needs info"]
                                    }
                                },
                                doYouHaveParentalResponsibility: data["Child 5 parental responsibility?"],
                                isThere6thChild: data["Is there a 6th child?"]
                            },

                        },
                        {
                            child6: {
                                firstName: data["Name Child 6"],
                                surName: data["Surname Child 6"],
                                gender: data["Child 6 gender"],
                                livingWithWho: data["Child 6 living with?"],
                                DateOfBirth: data["Child 6 DoB"],
                                haveAnySpecialNeeds: {
                                    answer: data["Child 6 has special needs?"],
                                    related: {
                                        whatSpecialNeeds: data["Child 6 special needs info"]
                                    }
                                },
                                doYouHaveParentalResponsibility: data["Child 6 parental responsibility?"],

                            },
                        },
                    ],
                }
            },

        },
        ifThereanyDayscantMake: {
            answer: data["Dates you cannot attend?"],
            related: {
                datesCantAttendMediation: data["Dates not attending"],
            }
        },
        whenWouldLikeAppointmentTime: data["when would you like your appointment?"],
        Client2Details: {

            whoIsinTheConflict: data["Please tell us who is the other party in the conflict."],
            FirstName: data["What is the other party's first name?"],
            SurName: data["What is the other party's surname/family name?"],
           // BirthDate: data,
            Email: data["What is your ex-partner's email address?"],
            PhoneNumber: data["What is your ex-partner's phone number?"],
            DoYouKnowhisaddress: {
                answer: data["Do you know the other party's home address?"],
                related: {
                    houseNumberandStreet: data["What is your ex-partner's address? - Street"],
                    cityandTown: data["What is your ex-partner's address? - City/Suburb"],
                   // country: data,
                    postCode: data["What is your ex-partner's address? - Zip/Post Code"],
                }

            }
        },
        ExPartnerDetails: {
            separationDate: data["When did you separate from your ex-partner?"],
            relationDuration: data["How long were you in a relationship with your ex-partner?"],
            wereMarried: {
                answer: data["Were you married or in a civil partnership to your ex-partner?"],
                related: {
                    marriageDate: data["What was the date of your marriage/civil partnership?"]
                }
            }

        },
        CourtProceedings: {
            awareofanylegalproceedings: {
                answer: data["Any legal proceedings?"],
                related: { awarnessInformation: data["Info about legal proceedings"] }
            },

            knowcourtapplicationshavebeenmade:
            {
                answer: data["Court applications made?"],
                related: {
                    DetailsAboutCourtsandDates: data["Court proceedings info"]
                }
            },
        },
        MartialStatus: data["What is your marital status?"],
        SolicitororMcKenziefriendsdetails: {
            answer: {
                haveOrnot: data["Do you have a solicitor?"],
            },
            related: {
                Names: data["Solicitor's name"],
                nameOfTheLawFirm: data["Name of the law firm?"],
                PhoneNumbers: data["Law firm telephone?"],
                PhoneEmails: data["Law firm's email?"],

            }
        },
        WantCertificateToSentToThem: data["Court form to be sent to the solicitor?"],
        FreeConsultaionRegardingLegalSupport: data["Free consultation?"],
        ClientCareLetter: {
            confirmReadingLetter: data["I have read my client care letter"],
            confirmwatchingMIAMvideo: data[ "I have watched the MIAM video"],

        }






    }


}

/*
  C1: {

           

            
    
     
     

     

      
  

    }
*/
