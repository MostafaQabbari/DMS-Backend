const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");


router.get("/getMediators" ,authMiddleware,async (req,res)=>{


    const mediatorsIDs = req.user.mediators;
    let response =[];
    for(let i=0 ; i< mediatorsIDs.length ; i++ )
    {
       const med = await mediator.findById(mediatorsIDs[i]);
       response.push({name:`${med.firstName } ${med.lastName }`, email:med.email})
     
    }
    console.log(response)

    res.json(response)
})



module.exports = router;
