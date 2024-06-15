import React, { useState } from 'react';
import axios from 'axios'

const SearchPanel = (props) => {
  const [minTemp, setMinTemp] = useState(0); // state for min temperature
  const [maxTemp, setMaxTemp] = useState(100); // state for max temperature
  const [minDensity, setMinDensity] = useState(0); // state for min temperature
  const [maxDensity, setMaxDensity] = useState(75000); // state for max temperature

  const searchButtonTxt = "Browse Homes";
  const [buttonText, setButtonText] = useState(searchButtonTxt)
  
  const SERVER_URL = "http://localhost:3001"

  const handleMinTempChange = (event) => {
    setMinTemp(event.target.value); // update min temperature state
  };

  const handleMaxTempChange = (event) => {
    setMaxTemp(event.target.value); // update max temperature state
  };

  const handleMinDensityChange = (event) => {
    setMinDensity(event.target.value); 
  };

  const handleMaxDensityChange = (event) => {
    setMaxDensity(event.target.value); 
  };

  function browse()
  {
    setButtonText("Searching ...")
    // Click browse homes

    // This must run once for every lat-long that matches the other filters (temp)
    // Expensive: Select results, charge site credits for each that we want to search.
    // axios.post(`${SERVER_URL}/get-places`, {})

    // Display temperature matches for user to select from
    // reach server api to query excel sheet
    axios.post(`${SERVER_URL}/filter`, {minTemp, maxTemp, minDensity, maxDensity})
    .then((res) => {
      // Group data by State
      const groupedData = res.data.reduce((acc, item) => {
        const state = item.State;
        if (!acc[state]) {
          acc[state] = [];
        }
        acc[state].push(item);
        return acc;
      }, {});

      //console.log(groupedData)

      // Convert grouped data into an array of arrays
      const arrayOfArrays = Object.values(groupedData).sort((a, b) => a[0].State.localeCompare(b[0].State));;

      props.setResults(arrayOfArrays)
      //console.log(res.data)
      
    })
    .catch((e) => {
      console.log("Error filtering data: ", e)
    })

  }
  return (
    
      <div className="panel-container">
        <p style = {{fontWeight: 100, fontSize: 25, alignSelf: 'center'}}>Search for Homes</p>
        <div>
          <p>Desired temperature range (F)</p>
          <div className="temperature-hbox">
            
            <p>Low Temp: </p>
            <input
              type="range"
              class="form-range"
              min={0}
              max={120}
              value={minTemp}
              onChange={handleMinTempChange}
            />
            <p>{minTemp}</p>
          </div>
          
          <div className="temperature-hbox">
            <p>High Temp: </p>
            <input
              type="range"
              class="form-range"
              min={0}
              max={120}
              value={maxTemp}
              onChange={handleMaxTempChange}
            />

            <p>{maxTemp}</p>
          </div>

          <hr></hr>
        </div>

        <div>
          <p>Population density in people / mi²</p>

          <div className="temperature-hbox">
            <p>Min Density: </p>
            <input
              type="range"
              class="form-range"
              min={0}
              max={70000}
              value={minDensity}
              onChange={handleMinDensityChange}
            />
            <p>{minDensity}</p>
          </div>
          

          <div className="temperature-hbox">
            <p>Max Density: </p>
            <input
              type="range"
              class="form-range"
              min={0}
              max={75000}
              value={maxDensity}
              onChange={handleMaxDensityChange}
            />
            <p>{maxDensity}</p>
          </div>
          <hr></hr>
        </div>
        
        <button disabled = {buttonText !== searchButtonTxt} type="button" class="btn btn-primary" onClick={browse}>{buttonText}</button>
      </div>
  );

  
  
};

export default SearchPanel;
