
const express = require('express');
const router = express.Router();
const Case = require('../models/case');


router.patch("/addC1MIAM2/:id", async (req, res) => {


    try {

        let MIAM2mediator = req.body;
        let currentCase = await Case.findById(req.params.id);
        const stringfyMIAM2Data = JSON.stringify(MIAM2mediator)
        if (!currentCase.MIAM2AddedData) {

            await Case.findByIdAndUpdate(req.params.id, { MIAM2mediator: stringfyMIAM2Data, MIAM2AddedData: true , status:"C1 MIAM Part 2 Applied" })
        
            res.json({ "message": " MIAM2 has been added " })
        }
        else {
            res.json({ "message": "this MIAM2 has been added before" })
        }


    }
    catch (Err) {
        res.json({ "err": Err.message })
    }




})

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const Case = require('../models/case');
// const { uploadToGoogleDrive } = require('../utils/googleDrive');

// router.patch("/addC1MIAM2/:id", async (req, res) => {
//   try {
//     let MIAM2mediator = req.body;
//     let currentCase = await Case.findById(req.params.id);
//     const stringfyMIAM2Data = JSON.stringify(MIAM2mediator);
//     if (!currentCase.MIAM2AddedData) {
//       // Upload PDF files to Google Drive
//       const c100 = req.files.file1;
//       const formA = req.files.file2;
//       const fileId1 = await uploadToGoogleDrive(c100);
//       const fileId2 = await uploadToGoogleDrive(formA);
      
//       await Case.findByIdAndUpdate(req.params.id, {
//         MIAM2mediator: stringfyMIAM2Data,
//         MIAM2AddedData: true,
//         status: "C1 MIAM Part 2 Applied",
//         file1Id: fileId1,
//         file2Id: fileId2
//       });
  
//       res.json({ "message": "MIAM2 has been added" });
//     } else {
//       res.json({ "message": "This MIAM2 has been added before" });
//     }
//   } catch (err) {
//     res.json({ "err": err.message });
//   }
// });

// module.exports = router;
