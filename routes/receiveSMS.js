const router = require("express").Router();
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");
const decryptTwillioData = require("../middleware/getDataFromTwilio");

const validNumber = function (x) {

  if (!isNaN(Number(x))) {
      return true
  } else {
      return false
  }
}

const getMessgaes = async function(from , to ,twillioInfo ,res){
  const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
   let messages=[]
 
 
   Promise.all([
     x.messages.list({
       from: from, 
       to: to,
       // direction: 'inbound,outbound-api'
     }),
     x.messages.list({ 
       from: to, 
       to: from 
     })
   ]).then(results => {
     results.forEach(result => {
       result.forEach(message => {
         const messageBody = {
           id: message.sid,
           // from: message.direction === 'outbound-api' ? 'Company' : 'Client',
           // to: message.direction === 'outbound-api' ? 'Client' : 'Company',
           body: message.body,
           time: message.dateSent,
           status: message.status,
           direction : message.direction,
         };
         if(message.direction  === 'outbound-api')
         {
           messageBody.from ='Company';
           messageBody.to ='Client'
         }
         if(message.direction  === 'inbound')
         {
           messageBody.from ='Client';
           messageBody.to ='Company'
         }
   
         messages.push(messageBody);
        //  console.log(messageBody);
        
       });

     });
   
     messages.sort((a, b) => new Date(a.time) - new Date(b.time));
    // return messages;
   res.status(200).json(messages)
 
   })
   
   .catch(error => {
     console.log(error);
   });
}

// router.get("/receiveSMS", authMiddleware, async (req, res) => {

//   try {


//     // const x = require('twilio')(twillioSID, twillioToken);
//     // const phoneNumber = twillioNumber;
//     /*
//     twillioSID : ACb1a7cb22177625214bc3a86ee3bfbfd6
//     twillioToken : e7380ebe9db5a0dff0590b5e2681386b
//     numbers     +447476544877    /  +13252252480
//     */
//     const x = require('twilio')('ACb1a7cb22177625214bc3a86ee3bfbfd6', 'e7380ebe9db5a0dff0590b5e2681386b');
//     const phoneNumber = '+447476544877';


//     x.messages.list({ to: phoneNumber })
//       .then(messages => {
//         res.send(messages);
//       })
//       .catch(error => {
//         console.error(error);
//         res.status(500).send('Error retrieving messages');
//       });

//   }
//   catch (err) {
//     res.json({ err: err.message })
//   }
// })

/*

  📢📢 get("/chatSMSbyNumber/:number"   
  📢📢  get("/chatSMSC1/:id"      
  📢📢  get("/chatSMSC2/:id"
 


  📢📢 res example : 
   [
    {
        "id": "SM53b7a6e91c1e43f3936f12ace555ff98",
        "body": "Your Client undefined added his twillio",
        "time": "2023-06-07T12:15:08.000Z",
        "status": "delivered",
        "direction": "outbound-api",
        "from": "Company",
        "to": "Client"
    },
    {
        "id": "SMcc757d7a2e2056c26cfa43f4b844c0ee",
        "body": "Your Client undefined added his twillio",
        "time": "2023-06-07T12:15:09.000Z",
        "status": "received",
        "direction": "inbound",
        "from": "Client",
        "to": "Company"
    }
]
    

*/
router.get("/chatSMSbyNumber/:number", authMiddleware,decryptTwillioData, async (req, res) => {

  let twillioInfo = req.twillioInfo
  let otherNumber = req.params.number;
 // console.log(twillioInfo)

   getMessgaes(twillioInfo.twillioNumber ,otherNumber ,twillioInfo,res);
  

});



router.get("/chatSMSC1/:id", authMiddleware,decryptTwillioData, async (req, res) => {
  try {
   let twillioInfo = req.twillioInfo
    //console.log( req.params.id)
    if (req.userRole == "company"){ 
    let CaseFoundID
     // let cases = await Company.findById(req.user._id).populate('cases');
     let comp = await Company.findById(req.user._id);

     for (let i = 0; i < comp.cases.length; i++) {
       
     
        if (comp.cases[i] == req.params.id) {
        
          CaseFoundID = (comp.cases[i])
          
        }
      }
      if(!CaseFoundID){
        res.status(400).json("You don't access on this case")
      }
      else{
      let CaseFound=  await Case.findById(CaseFoundID);
      
      if(CaseFound.MajorDataC1.phoneNumber){
        let C1number = CaseFound.MajorDataC1.phoneNumber
            if(validNumber(C1number))
            {
              // let testNumSender = "+447359624736"   // will be replaced by  ]=> twillioInfo.twillioNumber
              // C1number = "+447824627002"  // this line will be removed
             // console.log(C1number)
             
              getMessgaes( twillioInfo.twillioNumber ,C1number ,twillioInfo, res);
       
            }
             else
            {
              res.status(400).json("please make sure about the c1 phone number  ")
            }
            
      }
      else{
        res.status(400).json("there is no phone number for c1 ")
      }
    
      }
      
 
    }
    if (req.userRole == "mediator"){ 
      let CaseFoundID
       // let cases = await Company.findById(req.user._id).populate('cases');
       let comp = await mediator.findById(req.user._id);
  
       for (let i = 0; i < comp.cases.length; i++) {
         
       
          if (comp.cases[i] == req.params.id) {
          
            CaseFoundID = (comp.cases[i])
            
          }
        }
        if(!CaseFoundID){
          res.status(400).json("You don't access on this case")
        }
        else{
        let CaseFound=  await Case.findById(CaseFoundID);
        
        if(CaseFound.MajorDataC1.phoneNumber){
          let C1number = CaseFound.MajorDataC1.phoneNumber
              if(validNumber(C1number))
              {
                // let testNumSender = "+447359624736"   // will be replaced by  ]=> twillioInfo.twillioNumber
                // C1number = "+447824627002"  // this line will be removed
               // console.log(C1number)
               
                getMessgaes( twillioInfo.twillioNumber ,C1number ,twillioInfo, res);
         
              }
               else
              {
                res.status(400).json("please make sure about the c1 phone number  ")
              }
              
        }
        else{
          res.status(400).json("there is no phone number for c1 ")
        }
      
        }
        
   
      }
    else
    {
      res.status(400).json("something wrong with auth ... ")
    }

  }catch (err) {
    res.status(400).json(err.message)
  }


});

router.get("/chatSMSC2/:id", authMiddleware,decryptTwillioData, async (req, res) => {
  try {
   let twillioInfo = req.twillioInfo
    //console.log( req.params.id)
    if (req.userRole == "company"){ 
    let CaseFoundID
     // let cases = await Company.findById(req.user._id).populate('cases');
     let comp = await Company.findById(req.user._id);

     for (let i = 0; i < comp.cases.length; i++) {
       
     
        if (comp.cases[i] == req.params.id) {
        
          CaseFoundID = (comp.cases[i])
          
        }
      }
      if(!CaseFoundID){
        res.status(400).json("You don't access on this case")
      }
      else{
      let CaseFound=  await Case.findById(CaseFoundID);
      
      if(CaseFound.MajorDataC2.phoneNumber){
        let C2number = CaseFound.MajorDataC2.phoneNumber
            if(validNumber(C2number))
            {
              // let testNumSender = "+447359624736"   // will be replaced by  ]=> twillioInfo.twillioNumber
              // C1number = "+447824627002"  // this line will be removed
             // console.log(C1number)
             
              getMessgaes( twillioInfo.twillioNumber ,C2number ,twillioInfo, res);
       
            }
             else
            {
              res.status(400).json("please make sure about the c2 phone number  ")
            }
            
      }
      else{
        res.status(400).json("there is no phone number for c2 ")
      }
    
      }
      
 
    }
    if (req.userRole == "mediator"){ 
      let CaseFoundID
       // let cases = await Company.findById(req.user._id).populate('cases');
       let comp = await mediator.findById(req.user._id);
  
       for (let i = 0; i < comp.cases.length; i++) {
         
       
          if (comp.cases[i] == req.params.id) {
          
            CaseFoundID = (comp.cases[i])
            
          }
        }
        if(!CaseFoundID){
          res.status(400).json("You don't access on this case")
        }
        else{
        let CaseFound=  await Case.findById(CaseFoundID);
        
        if(CaseFound.MajorDataC2.phoneNumber){
          let C2number = CaseFound.MajorDataC2.phoneNumber
              if(validNumber(C2number))
              {
                // let testNumSender = "+447359624736"   // will be replaced by  ]=> twillioInfo.twillioNumber
                // C1number = "+447824627002"  // this line will be removed
               // console.log(C1number)
               
                getMessgaes( twillioInfo.twillioNumber ,C2number ,twillioInfo, res);
         
              }
               else
              {
                res.status(400).json("please make sure about the c2 phone number  ")
              }
              
        }
        else{
          res.status(400).json("there is no phone number for c2 ")
        }
      
        }
        
   
      }
    else
    {
      res.status(400).json("something wrong with auth ... ")
    }

  }catch (err) {
    res.status(400).json(err.message)
  }


});

module.exports = router

 
  
  // x.messages.list({ 
  //   from: toNumber, 
  //   to: fromNumber 
  // }).then(messages => {
  //   
  //   messages.forEach(message => {
  //     messageBody.id=message.sid
  //     messageBody.from = "Client"
  //     messageBody.to="Company"
  //     messageBody.body = message.body
  //     messageBody.time = message.dateSent
  //     messageBody.status = message.status;
  //     messages.push(messageBody)
  //     console.log(messageBody)
  //   });
  // }).catch(error => {
  //   console.log(error);
  // });


  
  
