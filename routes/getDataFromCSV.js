
const csv = require('csv-parser');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const multer = require('multer')
const Case = require('../models/case');
const mediator = require('../models/mediator');

const CSVdata  = require('../interface/CSVdata')

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




module.exports = router







/*
    const file = req.files.file; // Assuming you are using a file upload library such as 'multer'
  
    fs.createReadStream(file.tempFilePath)
      .pipe(csv())
      .on('data', (data) => {
        // Process each row of the CSV data and insert it into MongoDB
        MongoClient.connect(mongoURL, (err, client) => {
          if (err) {
            console.error('Error connecting to MongoDB:', err);
            return;
          }
  
          const db = client.db(dbName);
          const collection = db.collection('your-collection-name'); // Update with your collection name
  
          // Insert the data into the collection
          collection.insertOne(data, (err, result) => {
            if (err) {
              console.error('Error inserting data:', err);
            }
          });
  
          client.close();
        });
      })
      .on('end', () => {
        res.send('Data imported successfully');
      });
  });
  
   */

