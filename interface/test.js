{
    personalInfo: {
      firstName: formState.firstName,
      surName: formState.secondName,
      dateOfBirth: formState.date,
      phoneNumber: formState.phone,
      email: formState.email,
      location: {
        houseNumberStreet: formState.address,
        cityTown: formState.city,
        postCode: formState.postCode,
        country: formState.country,
      },
      participantKnoworNot: {
        answer: formState.otherContent,
        related: {
          needtoSureDetails: formState.confidential,
        },
      },
      vulnerableAdult: formState.vulnerableAdult,
      Disability: formState.disabledSelected,
      gender: formState.genderSelected,
    },
    willingMediationtoSortIssues: {
      answer: formState.willingSelected,
      related: {
        shouldDoChangesToAttendMediation: {
          answer: formState.makeChanges,
          related: {
            WhatcanWedotoassist: formState.assist,
          },
        },

        willBringAnyoneToSupport: {
          answer: formState.support,
          related: {
            fullNameOfSupportingPerson: formState.supportingPerson,
          },
        },
      },
    },
    nationality: {
      enthnicOrigin: formState.ethnic,
      haveBritishNationalityorPassport: {
        answer: formState.british,
        related: {
          migrationDetailsToUK: formState.immigration,
        },
      },
    },
    DMSreservationDetails: {
      howFoundDMS: formState.find,
      facingIssues: {
        answer: formState.issues,
        related: {
          childrens: [
            {
              child1: {
                firstName: formState.childFirstName,
                surName: formState.childFirstFamilyName,
                gender: formState.childFirstGender,
                livingWithWho: formState.childFirstLiving,
                DateOfBirth: formState.childFirstDoB,
                haveAnySpecialNeeds: {
                  answer: formState.childFirstIssues,
                  related: {
                    whatSpecialNeeds: formState.childFirstNeeds,
                  },
                },
                doYouHaveParentalResponsibility:
                  formState.childFirstParentalResponsibility,
                isThere2ndChild: formState.checkSecondChild,
              },
            },
            {
              child2: {
                firstName: formState.childSecondName,
                surName: formState.childSecondFamilyName,
                gender: formState.childSecondGender,
                livingWithWho: formState.childSecondLiving,
                DateOfBirth: formState.childSecondDoB,
                haveAnySpecialNeeds: {
                  answer: formState.childSecondIssues,
                  related: {
                    whatSpecialNeeds: formState.childSecondNeeds,
                  },
                },
                doYouHaveParentalResponsibility:
                  formState.childSecondParentalResponsibility,
                isThere3rdChild: formState.checkThirdChild,
              },
            },
            {
              child3: {
                firstName: formState.childThirdName,
                surName: formState.childThirdFamilyName,
                gender: formState.childThirdGender,
                livingWithWho: formState.childThirdLiving,
                DateOfBirth: formState.childThirdDoB,
                haveAnySpecialNeeds: {
                  answer: formState.childThirdIssues,
                  related: {
                    whatSpecialNeeds: formState.childThirdNeeds,
                  },
                },
                doYouHaveParentalResponsibility:
                  formState.childThirdParentalResponsibility,
                isThere4thChild: formState.checkFourthChild,
              },
            },
            {
              child4: {
                firstName: formState.childFourthName,
                surName: formState.childFourthFamilyName,
                gender: formState.childFourthGender,
                livingWithWho: formState.childFourthLiving,
                DateOfBirth: formState.childFourthDoB,
                haveAnySpecialNeeds: {
                  answer: formState.childFourthIssues,
                  related: {
                    whatSpecialNeeds: formState.childFourthNeeds,
                  },
                },
                doYouHaveParentalResponsibility:
                  formState.childFourthParentalResponsibility,
                isThere5thChild: formState.checkFifthChild,
              },
            },
            {
              child5: {
                firstName: formState.childFifthName,
                surName: formState.childFifthFamilyName,
                gender: formState.childFifthGender,
                livingWithWho: formState.childFifthLiving,
                DateOfBirth: formState.childFifthDoB,
                haveAnySpecialNeeds: {
                  answer: formState.childFifthIssues,
                  related: {
                    whatSpecialNeeds: formState.childFifthNeeds,
                  },
                },
                doYouHaveParentalResponsibility:
                  formState.childFifthParentalResponsibility,
                isThere6thChild: formState.checkSixthChild,
              },
            },
            {
              child6: {
                firstName: formState.childSixthName,
                surName: formState.childSixthFamilyName,
                gender: formState.childSixthGender,
                livingWithWho: formState.childSixthLiving,
                DateOfBirth: formState.childSixthDoB,
                haveAnySpecialNeeds: {
                  answer: formState.childSixthIssues,
                  related: {
                    whatSpecialNeeds: formState.childSixthNeeds,
                  },
                },
                doYouHaveParentalResponsibility:
                  formState.childSixthParentalResponsibility,
              },
            },
          ],
        },
      },
      ifThereanyDayscantMake: {
        answer: formState.daysCanNotMake,
        related: {
          datesCantAttendMediation: formState.daysCanNotAttend,
        },
      },

      whenWouldLikeAppointmentTime: formState.appointment,
    },
    Client2Details: {
      whoIsinTheConflict: formState.otherParty,
      FirstName: formState.otherName,
      SurName: formState.otherNameFamilyName,
      BirthDate: formState.otherPersonDate,
      Email: formState.otherPersonEmail,
      PhoneNumber: formState.otherNamePhone,
      DoYouKnowhisaddress: {
        answer: formState.otherNameAddressCheck,
        related: {
          houseNumberandStreet: formState.otherNameAddress,
          cityandTown: formState.otherNameCity,
          country: formState.otherNameCountry,
          postCode: formState.otherNamePostCode,
        },
      },
    },
    ExPartnerDetails: {
      separationDate: formState.separate,
      relationDuration: formState.relationship,
      wereMarried: {
        answer: formState.partnershipCheck,
        related: {
          marriageDate: formState.marriage,
        },
      },
    },
    CourtProceedings: {
      awareofanylegalproceedings: {
        answer: formState.proceedings,
        related: { awarnessInformation: formState.infoProceedings },
      },

      knowcourtapplicationshavebeenmade: {
        answer: formState.courtApplications,
        related: {
          DetailsAboutCourtsandDates: formState.courtInfo,
        },
      },
    },
    MartialStatus: formState.maritalStatus,
    SolicitororMcKenziefriendsdetails: {
      answer: { haveOrnot: formState.solicitor },
      related: {
        Names: formState.solicitorName,
        nameOfTheLawFirm: formState.solicitorLawName,
        PhoneNumbers: formState.solicitorTelephone,
        PhoneEmails: formState.solicitorEmail,
      },
    },
    WantCertificateToSentToThem: formState.mediationCertificate,
    FreeConsultaionRegardingLegalSupport: formState.consultation,
    ClientCareLetter: {
      confirmReadingLetter: "Yes",
      confirmwatchingMIAMvideo: "Yes",
    },
  },