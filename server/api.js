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

  
  router.post('/explore', async(req, response) => {
    let town = req.body.town
    //let radius = req.body.radius
    let types = ["bar", "school", "cafe"]
    


    axios.post(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="${town.Latitude},${town.Longitude}+"&radius="${10}"&types="${types}"&key=${process.env.MAPS_KEY}`)
    .then((res) => {
      console.log(res)
      response.send(res)
    })
    .catch((e) =>
    {
      console.log(e)
    })
  })


  module.exports = router;