import React, { useState } from 'react';
import axios from 'axios'

const SearchPanel = (props) => {
  // Pull search options from localData
  let opts = JSON.parse(localStorage.getItem('search_options'))
  if (!opts)
    opts = {}

  const stored_mintemp = opts.mintemp? opts.mintemp : 10
  const stored_maxtemp = opts.maxtemp? opts.maxtemp : 100
  const stored_mindensity = opts.mindensity? opts.mindensity : 100
  const stored_maxdensity = opts.maxdensity? opts.maxdensity : 30000

  const [minTemp, setMinTemp] = useState(stored_mintemp); // state for min temperature
  const [maxTemp, setMaxTemp] = useState(stored_maxtemp); // state for max temperature
  const [minDensity, setMinDensity] = useState(stored_mindensity); // state for min temperature
  const [maxDensity, setMaxDensity] = useState(stored_maxdensity); // state for max temperature

  let searchButtonTxt = "Browse Cities";
  const [buttonText, setButtonText] = useState(searchButtonTxt)
  
  



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

  const confirmMinTempChange = (event) => {
    opts.mintemp = event.target.value
    localStorage.setItem("search_options", JSON.stringify(opts))
  };

  const confirmMaxTempChange = (event) => {
    opts.maxtemp = event.target.value
    localStorage.setItem("search_options", JSON.stringify(opts))

  };

  const confirmMinDensityChange = (event) => {
    opts.mindensity = event.target.value
    localStorage.setItem("search_options", JSON.stringify(opts))
    

  };

  const confirmMaxDensityChange = (event) => {
    opts.maxdensity = event.target.value
    localStorage.setItem("search_options", JSON.stringify(opts))


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
    axios.post(`${props.SERVER_URL}/filter`, {minTemp, maxTemp, minDensity, maxDensity})
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
              onBlur={confirmMinTempChange}
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
              onBlur={confirmMaxTempChange}
            />

            <p>{maxTemp}</p>
          </div>

        </div>

        <div>
          <p>Population density in people / mi²</p>

          <div className="temperature-hbox">
            <p>Min Density: </p>
            <input
              type="range"
              class="form-range"
              min={0}
              max={75000}
              value={minDensity}
              onChange={handleMinDensityChange}
              onBlur={confirmMinDensityChange}
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
              onBlur={confirmMaxDensityChange}
            />
            <p>{maxDensity}</p>
          </div>
        </div>
        
        <button disabled = {buttonText !== searchButtonTxt} type="button" class="btn btn-primary" onClick={browse}>{buttonText}</button>
      </div>
  );

  
  
};

export default SearchPanel;
