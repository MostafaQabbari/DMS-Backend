
const csv = require('csv-parser');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const airTableData = require('../interface/CSVdata')


const Airtable = require('airtable');


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
  let xxx;
  const fullcase = [];

  try {
    const records = await base(tableName).select({
      view: 'viwxrs9ZXzEcqLjWK',
      maxRecords: 1
    }).all();

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      if (record.fields['RecordID (from Ex Partner)']) {
        const recordC2 = await base(tableName).find(record.fields['RecordID (from Ex Partner)']);

        let c1 = record.fields;
         let c2 = recordC2.fields;
         fullcase.push({ c1: c1, c2: c2 });

        xxx=  airTableData(c1)

        // let c1 = record.fields['RecordID'];
        // let c2 = recordC2.fields['RecordID'];
        // fullcase.push({ c1: c1, c2: c2 });
        console.log("case data",xxx);
      }
    }

    

    res.json(xxx);
  } catch (err) {
    console.error('Error:', err.message);
    res.json({ error: 'An error occurred' });
  }
});




// router.post('/getDataFromAirtable2', (req, res) => {

//   /**
//  * apiKey: 'keySEWVOJ1gOsDSSP'
//  * base : 'efQFIQirYoTu5B' 
//  * tableID = 'tblkEfKYHH6sjHiNK';
//  *  view: 'viwLuC08eiToGUL3I', // 'VIEW1_ID' 
//  * view: 'viwKS3v3jJv8tu1TY', // 'VIEW2_ID' 
//  */

//   const axios = require('axios');

//   const apiKey = 'keySEWVOJ1gOsDSSP';
//   const baseId = 'efQFIQirYoTu5B';
//   const tableName = 'tblkEfKYHH6sjHiNK';
//   const view1Id = 'viwLuC08eiToGUL3I';
//   const maxRecords = 2;
//   const apiUrl = `https://api.airtable.com/v0/app${baseId}/Calendly%20Appointments`;

//   const headers = {
//     Authorization: `Bearer ${apiKey}`,
//   };

//   const view1Records = [];
//   const V1ids = [];
//   const view2Records = [];

//   axios
//     .get(apiUrl, {
//       headers,
//       params: {
//         view: view1Id,
//         maxRecords,
//       },
//     })
//     .then(response => {
//       const records = response.data.records;

//       records.forEach(record => {
//         let x = record.fields['RecordID'];
//         V1ids.push(x);
//         view1Records.push(record);

//         if (record.fields['RecordID (from Ex Partner)']) {
//           axios
//             .get(`${apiUrl}/${record.fields['RecordID (from Ex Partner)']}`, {
//               headers,
//             })
//             .then(response => {
//               const recordC2 = response.data;
//               view2Records.push(recordC2.fields['RecordID']);

//               console.log('v2 from v1 record partner', view2Records);
//             })
//             .catch(error => {
//               console.error('Error:', error);
//               view2Records.push('this one not found');
//             });
//         } else {
//           view2Records.push('this one not found');
//         }

//         console.log('v1 recordID', V1ids);
//       });
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });




// });


module.exports = router





