
import React, { useEffect, useState } from 'react';
import axios from 'axios'

import SearchPanel from './SearchPanel';
import SavedPanel from './SavedPanel';
import AccountPanel from './AccountPanel';

import Results from './Results';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'

// Need data to be persistent between db and local.
// Must store user id on local storage to use in api calls.
// when we log in, also set userdata localstorage item to be the user database item fields of interest
// we can now directly modify the local storage value, and set in the database as well.

const Main = () => {
  const SERVER_URL = "http://localhost:3001"

  const stored_bookmarks = JSON.parse(localStorage.getItem('bookmarks')) // Load stored bookmakrs
  const stored_explored = JSON.parse(localStorage.getItem('explored')) // Load stored bookmakrs


  const [results, setResults] = useState()
  const [bookmarks, setBookmarks] = useState(stored_bookmarks ? stored_bookmarks : {})
  const [explored, setExplored] = useState(stored_explored ? stored_explored : {})


  
  document.body.style = 'background: #f2f2f2';

  function bookmark(town)
  {
    // toggle bookmark status of the town
    if (town.City + "-" + town.id in bookmarks)
    {
      // It is bookmarked
      setBookmarks(prevBookmarks => {
        const { [town.City + "-" + town.id]: _, ...newBookmarks } = prevBookmarks;
        return newBookmarks;
      });
    }
    else
    {
      // Add bookmark
      setBookmarks(prevBookmarks => ({
        ...prevBookmarks,
        [town.City + "-" + town.id]: town
      }));
    }
  }

  // Explore this town, searching nearby for specified ?? or pre-defined ?? hotspots (supermarket, gym, hardware store..)
  function explore(town)
  {
    // open modal immediately while waiting
// TODO


    // if we explored it, view details
    if (town.City + "-" + town.id in explored)
    {
      // do nothing ... modal is open ... wait for response
    }

    else // if not, explore it! Can prompt modal here to double check
    {
      // Add to explored : don't wanna do this until we get an OK response, incase of error...
      axios.post(`${SERVER_URL}/explore`, {town: town})
      .then ((res) => {
        setExplored(prevExplored => ({
          ...prevExplored,
          [town.City + "-" + town.id]: res.data
        }));
      })

      .catch ((e) => {
        // Set state error message to display on modal 
      })

      
    }
  }

  // When bookmakrs get updated, save to local storage
  useEffect(() => {
    if (bookmarks && bookmarks !== stored_bookmarks)
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks, stored_bookmarks])

  useEffect(() => {
    if (explored && explored !== stored_explored)
      localStorage.setItem('explored', JSON.stringify(explored))
  }, [explored, stored_explored])

if (results)
return (
  <Results explore = {explore} explored = {explored} bookmark = {bookmark} bookmarks = {bookmarks} results = {results} setResults = {setResults}></Results>
)

return (
  <div style = {{padding: "10px"}}>
    <div style = {{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '10px', alignItems: 'center', justifyContent: 'center'}}>
      <AccountPanel setResults = {setResults}></AccountPanel>
      <SearchPanel  setResults = {setResults} SERVER_URL = {SERVER_URL}></SearchPanel>
      <SavedPanel   setResults = {setResults} bookmark = {bookmark} bookmarks = {bookmarks} explore = {explore} explored = {explored}></SavedPanel>
    </div>
  </div>
);

};


export default Main;
