
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
 *  view: 'viwLuC08eiToGUL3I', // 'VIEW1_ID' 
 * view: 'viwKS3v3jJv8tu1TY', // 'VIEW2_ID' 
 */

  const base = new Airtable({ apiKey: 'keySEWVOJ1gOsDSSP' }).base('appefQFIQirYoTu5B');

  const tableName = 'tblkEfKYHH6sjHiNK';

  const view1Records = [];
  const V1ids=[]
  const view2Records = [];

  base(tableName)
    .select({
      view: 'viwLuC08eiToGUL3I', // 'VIEW1_ID' 
      maxRecords: 4
    })
    .eachPage((records, fetchNextPage) => {

      records.forEach(record => {

        let x = record.fields['RecordID']
        V1ids.push(x)
       // console.log(";;;;;" ,x)
        view1Records.push(record);
        if (record.fields['RecordID (from Ex Partner)']) {
          base(tableName)

            .find((record.fields['RecordID (from Ex Partner)']), (err, recordC2) => {

              view2Records.push(recordC2.fields['RecordID'])

              console.log("v2 from v1 record partner", view2Records)

            })
        } else {
          view2Records.push("this one not found")
        }

        console.log("v1 recordID",V1ids)


      });

      fetchNextPage();
    }, err => {
      if (err) {
        console.error('Error:', err);
        return;
      }

      //console.log("id from cases", view1Records[1].fields['RecordID (from Cases (C1 Link))'])
      //console.log("id of c1 ", view1Records[1].fields['RecordID'])

      res.json(view1Records[1].fields['RecordID (from Ex Partner)'])
    });






});

router.post('/getDataFromAirtable2', (req, res) => {

  /**
 * apiKey: 'keySEWVOJ1gOsDSSP'
 * base : 'efQFIQirYoTu5B' 
 * tableID = 'tblkEfKYHH6sjHiNK';
 *  view: 'viwLuC08eiToGUL3I', // 'VIEW1_ID' 
 * view: 'viwKS3v3jJv8tu1TY', // 'VIEW2_ID' 
 */

  const base = new Airtable({ apiKey: 'keySEWVOJ1gOsDSSP' }).base('appefQFIQirYoTu5B');

  const tableName = 'tblkEfKYHH6sjHiNK';

  const view1Records = [];
  const view2Records = [];

  base(tableName)
    .select({
      view: 'viwLuC08eiToGUL3I', // 'VIEW1_ID' 
      maxRecords: 2
    })
    .eachPage((records, fetchNextPage) => {

      records.forEach(record => {
        view1Records.push(record);
        // if (record) {
        //   base(tableName)
        //   .select({
        //     view: 'viwKS3v3jJv8tu1TY', // 'VIEW1_ID' 
        //   }).find((record.fields['RecordID (from Cases (C1 Link))']), (err, recordC2) => {
        //       console.log("c2 record", recordC2.fields)
        //     })
        // }else{
        //   console.log("error record nt found")
        // }

      });

      fetchNextPage();
    }, err => {
      if (err) {
        console.error('Error:', err);
        return;
      }

      console.log(view1Records[0].fields['RecordID (from Cases (C1 Link))'])
      res.json(view1Records[0].fields)
    });






});


module.exports = router





