
const csv = require('csv-parser');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const airTableData = require('../interface/CSVdata')
const dummyCases = require('../interface/airtableDummyData')
const authMiddleware = require("../middleware/authMiddleware");
const Airtable = require('airtable');

const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");


router.post('/getDataFromCSV', (req, res) => {
  const filePath = 'uploads/csvAllData.csv'; // Update with the path to your CSV file
  console.log(filePath)
  const results = []

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      // Process each row of the CSV data

      if (results.length < 1) {
        // console.log(data)
        const x = CSVdata(data)
        results.push(data)
      }



    })
    .on('end', () => {
      res.json(results);
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      res.status(500).send('Error reading CSV file');
    });



});

/**
* apiKey: 'keySEWVOJ1gOsDSSP'
* base : 'appefQFIQirYoTu5B' 
* tableID = 'tblkEfKYHH6sjHiNK';
*  view: 'viwLuC08eiToGUL3I', // 'VIEW1_ID' 
* view: 'viwKS3v3jJv8tu1TY', // 'VIEW2_ID' 
*/
router.post('/getDataFromAirtable', async (req, res) => {
  const base = new Airtable({ apiKey: 'keySEWVOJ1gOsDSSP' }).base('appefQFIQirYoTu5B');
  const tableName = 'tblZd3HclNJY2BSIo';


  const fullcase = [];

  try {
    const records = await base(tableName).select({
      view: 'viwxrs9ZXzEcqLjWK',
      maxRecords: 250

    }).all();

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      if (record.fields['RecordID (from Ex Partner)']) {
        const recordC2 = await base(tableName).find(record.fields['RecordID (from Ex Partner)']);

        let c1 = airTableData(record.fields);
        let c2 = airTableData(recordC2.fields);
        fullcase.push([{ c1: c1 }, { c2: c2 }]);

      }
    }



    res.json(fullcase);
  } catch (err) {
    console.error('Error:', err.message);
    res.json({ error: 'An error occurred' });
  }
});


router.post('/addDummyCases', authMiddleware, async (req, res) => {
  console.log(req.user._id)
  let med = await mediator.findById(req.user._id)
  let client1data, MIAM2mediator, client2data, MIAM2C2;

  const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');

  for (let i = 0; i < 50 ; i++) {

    console.log(dummyCases[i])
    client1data = JSON.stringify(dummyCases[i][0].c1.MIAM1) 
    MIAM2mediator = JSON.stringify(dummyCases[i][0].c1.MIAM2) 
    client2data =  JSON.stringify(dummyCases[i][1].c2.MIAM1) 
    MIAM2C2 = JSON.stringify( dummyCases[i][1].c2.MIAM2);

   let newCase = await Case.insertMany(
      {
        client1data,
        MIAM2mediator,
        client2data,
        MIAM2C2,
        connectionData: { mediatorID: req.user._id, companyID: mediatorCompanyData.companyId._id }
      }
    );

    const compID = mediatorCompanyData.companyId._id;
    const medID = req.user._id
    await Company.findByIdAndUpdate(compID, { $push: { cases: newCase[0]._id } });
    await mediator.findByIdAndUpdate(medID, { $push: { cases: newCase[0]._id } });






  }
  // console.log({
  //   client1data, MIAM2mediator, client2data, MIAM2C2
  // })


  res.json(med.cases)
})




module.exports = router





