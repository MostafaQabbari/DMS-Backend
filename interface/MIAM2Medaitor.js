module.exports  = MIAM2Form=[{

mediatorData:{
    mediatorName:{type:String},
    mediatorEmail:{type:String},
},
MIAMdetails:{
    date:{type:Date},
    location:{type:String},
    MIAMforC1orC2:{type:String}

},
client1Data:{
    firstName:{type:String},
    surName:{type:String},
    email:{type:String},
    surNameofC2:{type:String}
},
caseLegalorPrivate:
{
    answer:{type:String},
    relatedifPrivate:{
        paymentHasBeenMade:{
            answer:{type:Boolean},
            reasonOfWhydidnotMade:{type:String}

        },
        paymentAdvancedExplained:{type:Boolean}
    }
},
MediationCommentsANDsafeguarding:{
    commentsFromMediator:{type:String},
    DomesticAbuseORviolence:{
        answer:{type:Boolean},
        RelatedifYes:{
            detailsForAbuseOrViolence:{type:String}
        }
    },
    policeInvolvement:{
        answer:{type:Boolean},
        RelatedifYes:{
            detailsOfIncidentsInvolving:{type:String}
        }
    },
    socialServicesInvolvement:{
        answer:{type:Boolean},
        RelatedifYes:{
            detailsOfsocialServicesInvolvement:{type:String}
        }
    },
    safeguardingIssues:{
        answer:{type:Boolean},
        RelatedifYes:{
            detailsOfsafeguardingIssues:{type:String}
        }
    },
    AreThereAnyCourtOrders:{
        answer:{type:Boolean},
        RelatedifYes:{
            detailsOfCourtOrders:{type:String}
        }
    },
    clientRequireSignposting:{
        answer:{type:Boolean},
        RelatedifYes:{
            whichOrgnizationsSignpostTheClient:{type:String}
        }
    },


},
typeOfMediation:{

    clientWillingToGoAhead:{
        answer:{type:Boolean},
        RelatedifYes:{
            wichFormOfMediation:{type:String}
        },
        RelatedifNo:{
            ReasonsForRefusal:[String]
        }
    },
    ConfirmLegalDispute:{
        answer:{type:String},
        ifThereChildarrangment:{
            isChildInclusiveMediationAppropriate :{

                answer:{type:Boolean},
                ifYes:{
                    DoesClientWishForChildInclusiveMediation:{type:String}
                }

            }

        },
        HasADRinformationGivenToTheClient:{
            answer:{type:Boolean},
            ifNo:{
                WhyADRwasnotProvided:{type:String}
            }

        }

    }

},
finalCommentsFromMediator:{
    IsTheCaseSuitableForMediation:{
        answer:{type:Boolean},
        ifNo:{
            whyNotSuitable:{type:String}
        }
    },
    NeedToUploadCourtForm:{
        answer:{type:String},
        related:{
            c100Bath:{type:String},
            FormA:{type:String},
          
        }

    },
   commentstoDMSadmin:{type:String }
}




}]