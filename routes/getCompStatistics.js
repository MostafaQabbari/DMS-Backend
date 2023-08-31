
const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Company = require("../models/company");



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

function filterArrayByMonthAndYear(data, year, month) {
    const filtredData = data.filter(item => {
        const [itemYear, itemMonth] = item.date.split('-');

        return Number(itemYear) === Number(year) && Number(itemMonth) === Number(month);
    });
    console.log(filtredData)
    return filtredData
}


router.post('/getStatistics', authMiddleware, async (req, res) => {
    /*
    {"month":"07" , "year":"2023"}
    */

    try {
        if (req.userRole == 'company') {
            const companyId = req.user._id;
            const compData = await Company.findById(companyId)
            let resData = []
            let month = req.body.month
            let year = req.body.year
            for (let i = 0; i < compData.statistics.length; i++) {
                resData.push(JSON.parse(compData.statistics[i]))

            }



            //console.log(resData);

            let data = filterArrayByMonthAndYear(resData, year, month)
            res.status(200).json(data)

        }

        else {
            res.status(400).json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

});



module.exports = router;