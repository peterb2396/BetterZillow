
import React, { useState } from 'react';

import SearchPanel from './SearchPanel';
import SavedPanel from './SavedPanel';
import AccountPanel from './AccountPanel';

import Results from './Results';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'


const Main = () => {
  const [results, setResults] = useState()

  
  document.body.style = 'background: #f2f2f2';

if (results)
return (
  <Results results = {results} setResults = {setResults}></Results>
)

return (
  <div style = {{padding: "10px"}}>
    <div style = {{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '10px', alignItems: 'center', justifyContent: 'center'}}>
      <AccountPanel setResults = {setResults}></AccountPanel>
      <SearchPanel setResults = {setResults}></SearchPanel>
      <SavedPanel setResults = {setResults}></SavedPanel>
    </div>
  </div>
);

};


export default Main;
