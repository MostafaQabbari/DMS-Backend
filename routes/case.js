const express = require('express');
const router = express.Router();

const Case = require('../models/case');

const authMiddleware = require("../middleware/authMiddleware");
const mediator = require('../models/mediator');

router.post('/create-case', authMiddleware, async (req, res, next) => {

  //console.log(req.userRole);

try{
  
  const { firstName , surName, phoneNumber , dateOfMAIM , location } = req.body;
 // console.log(req.body)
  if (req.userRole == 'company') {
   // console.log(req.body)
    await Case.insertMany(
    {
      client1ContactDetails: { firstName , surName, phoneNumber , dateOfMAIM , location } ,
      connectionData: { companyID: req.user._id } 
    }

    )

    res.json({ message: " company has added client " })
  }
  else if (req.userRole == 'mediator') {


    const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId')
    console.log( mediatorCompanyData.companyId._id )
    await Case.insertMany(

  {
    client1ContactDetails: { firstName , surName, phoneNumber , dateOfMAIM , location } ,
    connectionData: { mediatorID: req.user._id, companyID: mediatorCompanyData.companyId._id } 
  }

    )

    res.json({ message: " mediator has added client " })
  }
  else {
    res.json({ 'message': "error in the role of token" })
  }
}catch(err)
{
  res.json({message:"error with the end point"})
}

});

router.get('/test', async (req, res) => {

  const x = await mediator.find({ _id: '6454e93139652cb9b2f1de65' }).populate('companyId')
  console.log(x[0].companyId.companyName)

  res.json(x)
})

module.exports = router;
