
const csv = require('csv-parser');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const CSVdata = require('../interface/CSVdata')


const Airtable = require('airtable');


router.post('/getDataFromCSV', (req, res) => {
  const filePath = 'uploads/csvToTest.csv'; // Update with the path to your CSV file
  console.log(filePath)
  const results = []

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      // Process each row of the CSV data

      if (results.length < 1) {
        // console.log(data)
        const x = CSVdata(data)
        results.push(x)
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

router.post('/getDataFromAirtable', (req, res) => {

  /**
 * apiKey: 'keySEWVOJ1gOsDSSP'
 * base : 'efQFIQirYoTu5B' 
 * tableID = 'tblkEfKYHH6sjHiNK';
 */

  const base = new Airtable({ apiKey: 'keySEWVOJ1gOsDSSP' }).base('appefQFIQirYoTu5B');

  const tableName = 'tblkEfKYHH6sjHiNK';

  const view1Records = [];
  const view2Records = [];

  base(tableName)
    .select({
      view: 'viwLuC08eiToGUL3I', // 'VIEW1_ID' 
      maxRecords: 20
    })
    .eachPage((records, fetchNextPage) => {

      records.forEach(record => {
        view1Records.push(record);
      });

      fetchNextPage();
    }, err => {
      if (err) {
        console.error('Error:', err);
        return;
      }
      

      // console.log(view1Records[0].fields['RecordID (from Cases (C1 Link))'])
      console.log('View 1 records fetched successfully.');
      // get C2 record
      base(tableName).find(view1Records[0].fields['RecordID (from Cases (C1 Link))'], (err, record) => {
        if (err) {
          console.error('Error:', err);
          return;
        }
      
        // Record C2 retrieved successfully
       
        console.log('Retrieved record:', record.fields);
      });

      res.json(view1Records[0].fields)
    });






});




module.exports = router





