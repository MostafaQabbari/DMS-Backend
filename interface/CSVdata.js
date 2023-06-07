// here is the blank of MIAM 1 and MIAM 2 section

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
                otherPartyDateOfBirth: data["Date of Birth (from Ex Partner)"],
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
            children: [{
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
                }},


             { childTwo: {
                    childFirstName: data["Name Child 2"],
                    childSurName: data["Surname Child 2"],
                    childGender: data["Child 2 gender"],
                    childLivingWith: data["Child 2 living with?"],
                    childDateOfBirth: data["Child 2 DoB"],

                    isChildHaveSpecialNeeds: data["Child 2 has special needs?"],

                    childSpecialNeeds: data["Child 2 special needs info"],

                    childResponsibility: data["Child 2 parental responsibility?"],
                    thirdChildCheck: data["Is there a 3rd child?"]
                }},

                {childThree: {
                    childFirstName: data["Name Child 3"],
                    childSurName: data["Surname Child 3"],
                    childGender: data["Child 3 gender"],
                    childLivingWith: data["Child 3 living with?"],
                    childDateOfBirth: data["Child 3 DoB"],

                    isChildHaveSpecialNeeds: data["Child 3 has special needs?"],

                    childSpecialNeeds: data["Child 3 special needs info"],

                    childResponsibility: data["Child 3 parental responsibility?"],
                    fourthChildCheck: data["Is there a 4th child?"]
                }},

                {childFour: {
                    childFirstName: data["Name Child 4"],
                    childSurName: data["Surname Child 4"],
                    childGender: data["Child 4 gender"],
                    childLivingWith: data["Child 4 living with?"],
                    childDateOfBirth: data["Child 4 DoB"],

                    isChildHaveSpecialNeeds: data["Child 4 has special needs?"],

                    childSpecialNeeds: data["Child 4 special needs info"],


                    childResponsibility: data["Child 4 parental responsibility?"],
                    fifthChildCheck: data["Is there a 5th child?"]
                }},

                {child5: {
                    childFirstName: data["Name Child 5"],
                    childSurName: data["Surname Child 5"],
                    childGender: data["Child 5 gender"],
                    childLivingWith: data["Child 5 living with?"],
                    childDateOfBirth: data["Child 5 DoB"],

                    isChildHaveSpecialNeeds: data["Child 5 has special needs?"],

                    childSpecialNeeds: data["Child 5 special needs info"],

                    childResponsibility: data["Child 5 parental responsibility?"],
                    sixthChildCheck: data["Is there a 6th child?"]
                }},


               { childSix: {
                    childFirstName: data["Name Child 6"],
                    childSurName: data["Surname Child 6"],
                    childGender: data["Child 6 gender"],
                    childLivingWith: data["Child 6 living with?"],
                    childDateOfBirth: data["Child 6 DoB"],

                    isChildHaveSpecialNeeds: data["Child 6 has special needs?"],

                    childSpecialNeeds: data["Child 6 special needs info"],

                    childResponsibility: data["Child 6 parental responsibility?"],

                }},
            ],
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

        MIAM2: {

            mediationDetails: {
                MediatorName: data["Name of Mediator"],
                MediatorEmail: data["Email (from Name of Mediator)"],

                DateOfMIAM: data["Date of MIAM"],
                Location: data["MIAM Location"],
                SpecifiedLocation: ["MIAM Location"],
                C1OrC2: data["Client 1 or 2?"],


                clientFirstName: data['First Name'],
                clientSurName: data['Surname'],
                clientEmail: data["Client Email Address"],
                otherPartySurname: data["What is the other party's surname/family name?"]
            },
            caseDetails:
            {
                privateOrLegalAid: data["Is the client private or legal aid?"],
                paymentMade: data["Has Payment Been Done for This Appointment"],
                whyPaymentNotMade: data["Reason Why Payment Not Done"],
                advancePayment: data["Payment in advance explained?"]
            },

            comments: {
                MediatorComments: data["Comments from the mediator"],

                isDomesticAbuseOrViolence: data["Domestic abuse or violence?"],

                domesticAbuseOrViolenceDetails: data["Please provide details for abuse or violence"],



                isPoliceInvolve: data["Any police involvement?"],

                policeInvolveDetails: data["Please provide details of any incidents involving the police."],


                isSocialServiceInvolve: data["Any Social Services involvement?"],

                socialServiceInvolveDetails: data["Please provide details of the  Social Services Department involvement?"],


                isSafeguardingIssues: data["Are there any safeguarding issues such as drugs or alcohol?"],

                safeguardingIssuesDetails: data["Please provide details of the safeguarding issues"],

                isCourtOrders: data["Any court orders in place?"],

                courtOrdersDetails: data["Court order details"],
                isClientRequireSignposting: data["Signposting required?"],
                clientRequireSignpostingDetails: data["Where did the mediator signposted?"]

            },




            MediationTypes: {


                isClientWillingToGoWithMediation: data["Is the client willing to go ahead with mediation?"],

                mediationFormPreference: data["Preferred Form of Mediation"],


                reasonsForRefusal: data["Reasons for refusal (Child Inclusive Mediation)"],

                confirmLegalDispute: data["Legal Dispute"],

                isChildInclusiveAppropriate: data['not found in airtable'],

                informationGivenToClient: data['not found in airtable'],




                explainWhyADRInfoWasNotProvided: data["ADR not provided"],

                clientPreference: data["Client prefer the mediation online or in person?"],




                areSeparateWaitingAreasRequired: data["Are separate waiting areas required?"],
                areSeparateArrivalAndDepartureTimesRequired: ["Are separate arrival and departure times required?"],

            },

            FinalComments: {

                isSuitable: data["Is the case suitable for mediation?"],

                whyNotSuitable: data["Why Case not suitable for mediation"],


                uploadCourtForm: data["Upload Court Forms?"],

                C100: data["C100"],
                FormA: data["FormA"],



                CommentsToDMS: data["Any comments to DMS admin team?"]
            },
        }




    }
}









