
const express = require('express');
const router = express.Router();
const config = require("../config/config");
const authMiddleware = require("../middleware/authMiddleware");
const Company = require("../models/company");
const fs = require('fs');
const http = require('http');


function filterByMonth(array, targetMonth) {
    // Convert the target month to a string with leading zero if necessary
    targetMonth = targetMonth < 10 ? `0${targetMonth}` : `${targetMonth}`;

    // Filter the array based on the target month
    const filteredArray = array.filter(item => {
        // Extract the month part from the "date" string (assuming date format: "YYYY-MM-DD")
        const itemMonth = item.date.split('-')[1];

        // Compare the extracted month with the target month
        return itemMonth === targetMonth;
    });

    return filteredArray;
}

// function convertToCSV(dataArray) {
//     const header = Object.keys(dataArray[0]).join(',');
//     const rows = dataArray.map(obj => Object.values(obj).map(val => `"${val}"`).join(','));
//     return [header, ...rows].join('\n');
// }


router.get('/getStatistics', authMiddleware, async (req, res) => {

    try {
        if (req.userRole == 'company') {
            const companyId = req.user._id;
            const compData = await Company.findById(companyId)
            let resData = []

            for (let i = 0; i < compData.statistics.length; i++) {
                resData.push(JSON.parse(compData.statistics[i]))

            }




            // Call the function to filter objects with a specific month (e.g., July)
          //  const filteredResults = filterByMonth(resData, 7);


            // const csvContent = convertToCSV(filteredResults);

            // // Write the CSV content to a file
            // fs.writeFile('data.csv', csvContent, err => {
            //     if (err) {
            //         console.error('Error writing CSV file:', err);
            //     } else {
            //         console.log('CSV file has been written successfully.');
            //     }
            // });

            //console.log(resData);

   
            res.status(200).json(resData)

        }

        else {
            res.status(400).json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

});



module.exports = router;