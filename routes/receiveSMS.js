const router = require("express").Router();
const company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");
const verifyTwillio = require("../middleware/twillioVerify");
const CryptoJS = require("crypto-js");
const decryptTwillioData = require("../middleware/getDataFromTwilio");



router.get("/receiveSMS", authMiddleware, async (req, res) => {

  try {


    // const x = require('twilio')(twillioSID, twillioToken);
    // const phoneNumber = twillioNumber;
    /*
    twillioSID : ACb1a7cb22177625214bc3a86ee3bfbfd6
    twillioToken : e7380ebe9db5a0dff0590b5e2681386b
    numbers     +447476544877    /  +13252252480
    */
    const x = require('twilio')('ACb1a7cb22177625214bc3a86ee3bfbfd6', 'e7380ebe9db5a0dff0590b5e2681386b');
    const phoneNumber = '+447476544877';


    x.messages.list({ to: phoneNumber })
      .then(messages => {
        res.send(messages);
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Error retrieving messages');
      });

  }
  catch (err) {
    res.json({ err: err.message })
  }
})


router.get("/chatSMS/:otherNumber", authMiddleware,decryptTwillioData, async (req, res) => {

  let twillioInfo = req.twillioInfo;
  console.log(twillioInfo)

  const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);

 // const phoneNumber = '+447476544877';
 // const phoneNumber1 = '+447476544877';  // my number
 // const phoneNumber2 = '+447359624736';   // other numbers

  const compNumber =twillioInfo.twillioNumber;
   const fromNumber = compNumber;
   const toNumber = req.params.otherNumber;

  ///const fromNumber = '+447476544877';
  ///const toNumber ='+447563842026'
  
  let messages=[]


  Promise.all([
    x.messages.list({
      from: fromNumber, 
      to: toNumber,
      // direction: 'inbound,outbound-api'
    }),
    x.messages.list({ 
      from: toNumber, 
      to: fromNumber 
    })
  ]).then(results => {
     messages = [];
  
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
        console.log(messageBody);
      });
    });
  
    messages.sort((a, b) => new Date(a.time) - new Date(b.time));

    res.json(messages);
  }).catch(error => {
    console.log(error);
  });

});

module.exports = router

 // const otherNumber = req.params.otherNumber;




  // Retrieve all the messages between the two phone numbers
  // x.messages.list({
  //   from: fromNumber, 
  //   to: toNumber,
  //  // direction: 'inbound,outbound-api'
  // }).then(messages => {
  //   // Loop through each message and log the details
  //   messages.forEach(message => {

  //     messageBody.id=message.sid
  //     messageBody.from = "Company"
  //     messageBody.to="Client"
  //     messageBody.body = message.body
  //     messageBody.time = message.dateSent
  //     messageBody.status = message.status;
  //     messages.push(messageBody)
  //     console.log(messageBody)
  //   });
  // }).catch(error => {
  //   console.log(error);
  // });

  
  // x.messages.list({ 
  //   from: toNumber, 
  //   to: fromNumber 
  // }).then(messages => {
  //   // Loop through each message and log the details
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

  // console.log(messages)
 


  // console.log(otherNumber)

  // x.messages.list({
  //   from: phoneNumber,
  //   to: otherNumber
  // })
  //   .then(messages => {
  //     res.send(messages);
  //   })
  //   .catch(error => {
  //     console.error(error);
  //     res.status(500).send('Error retrieving messages');
  //   });

  // x.messages.list({ from: '+447359624736' })
  // .then(messages => {
  //   // do something with the messages
  //   console.log(messages);
  // })
  // .catch(error => {
  //   console.log(error);
  // });

  // x.messages.list({ to: '+447359624736' })
  // .then(messages => {
  //   // do something with the messages
  //   console.log(messages);
  // })
  // .catch(error => {
  //   console.log(error);
  // });



  
  // Retrieve all the messages between the two phone numbers
  // x.messages.list({
  //   from: phoneNumber1,
  //   to: phoneNumber2
  // }).then(messages => {
  //   // Sort the messages by date and time
  //   messages.sort((a, b) => new Date(a.dateSent) - new Date(b.dateSent));
  
  //   // Create a new conversation
  //   x.conversations.v1.conversations.create({ friendlyName: 'My Conversation' })
  //     .then(conversation => {
  //       console.log(`Created new conversation with SID: ${conversation.sid}`);
  
  //       // Add the messages to the conversation
  //       const promises = messages.map(message => {
  //         return x.conversations.v1.conversations(conversation.sid)
  //           .messages.create({ body: message.body, author: message.from })
  //           .then(message => {

  //             messages.forEach(message => {
  //               console.log(`Message SID: ${message.sid}`);
  //               console.log(`Conversation SID: ${message.conversationSid}`);
  //               console.log(`From: ${message.author}`);
  //               console.log(`Body: ${message.body}`);
  //               console.log(`Date Sent: ${message.dateCreated}`);
  //               console.log(`Date Updated: ${message.dateUpdated}`);
  //               console.log(`Status: ${message.status}`);
  //               console.log('-----------------------');
  //             });


  //             console.log(`Added message with SID: ${message.sid} to conversation with SID: ${conversation.sid}`);
  //           })
  //           .catch(error => {
  //             console.log(error);
  //           });
  //       });
  
  //       // Wait for all promises to resolve
  //       return Promise.all(promises);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }).catch(error => {
  //   console.log(error);
  // });

