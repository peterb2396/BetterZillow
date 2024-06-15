  var express = require('express');
  var router = express.Router();
  require('dotenv').config();
  var axios = require('axios')
  const xlsx = require('xlsx');
  const path = require('path');

  const readAndFilterExcel = (mintemp, maxtemp, mindensity, maxdensity) => {
    const workbook = xlsx.readFile(path.join(__dirname, 'weather.xlsx'));
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
  
    // Filter the data based on the given temperature range
    return data.filter(row => row['Minimum Temperature'] > mintemp && row['Maximum Temperature'] < maxtemp && row['Density'] > (mindensity /2.59) && row['Density'] < (maxdensity /2.59));
  };
  
  // Define the endpoint
  router.post('/filter', (req, res) => {
  
    try {
      const filteredData = readAndFilterExcel(req.body.minTemp, req.body.maxTemp, req.body.minDensity, req.body.maxDensity);

      res.json(filteredData);
    } catch (error) {
      console.error('Error reading Excel file:', error);
      res.status(500).send('An error occurred while reading the Excel file.');
    }
  });

  // Delete account
  router.post('/get-places', async(req, response) => {
    let lat = req.body.lat
    let lon = req.body.lon
    let radius = req.body.radius
    let types = req.body.types

    // Restrict within the map viewport.
    axios.post(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="${lat},${lon}+"&radius="${radius}"&types="${types}"&key=${process.env.MAPS_KEY}`)
    .then((res) => {
      console.log(res)
    })
  })


  module.exports = router;