
import React, {  useState } from 'react';
import axios from 'axios'

import SearchPanel from './SearchPanel';
import SavedPanel from './SavedPanel';
import AccountPanel from './AccountPanel';
import Login from './Login';

import Results from './Results';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'

// Need data to be persistent between db and local.
// Must store user id on local storage to use in api calls.
// when we log in, also set userdata localstorage item to be the user database item fields of interest
// we can now directly modify the local storage value, and set in the database as well.

// Why would I use local storage for bookmarks / epxlored 
// if it is in the database anyway? If we login at a new location, our data should be there
// must pull database content each time we load the website.
// local storage becomes useless... ?????
// we are storing in db anyway.

// Stop with local storage.
// Use only DB, show loading screen as it loads.

const Main = () => {
  const SERVER_URL = "http://localhost:3001"


  const user_id = localStorage.getItem('id')
  const [user, setUser] = useState()


  const [results, setResults] = useState()
  const [bookmarks, setBookmarks] = useState()

  // is the user account con


  
  document.body.style = 'background: #f2f2f2';

  // Log in
  function loggedIn(user)
  {
    // store their data locally ...
    setUser(user)
    setBookmarks(user.bookmarks)
    
  }

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
        [town.City + "-" + town.id]: {town: town}
      }));
    }
  }

  // Explore this town, searching nearby for specified ?? or pre-defined ?? hotspots (supermarket, gym, hardware store..)
  function explore(town)
  {
    // open modal immediately while waiting

// TODO : Open modal, show loading / error / response UI's. 


    // if we explored it, view details
    if (town.City + "-" + town.id in bookmarks && bookmarks[town.City + "-" + town.id].explored)
    {
      // do nothing ... modal is open ... wait for response
    }

    else // if not, explore it! Can prompt modal here to double check
    {
      // Add to explored : don't wanna do this until we get an OK response, incase of error...
      // We need to pass UID to check their token count


      axios.post(`${SERVER_URL}/explore`, {town: town})
      .then ((res) => {

        // Update prevBookmarks, preserving town key
        setBookmarks(prevBookmarks => ({
          ...prevBookmarks,
          [town.City + "-" + town.id]: {
            ...prevBookmarks[town.City + "-" + town.id], // Preserve existing properties
            explored: true,
            data: res.data
          }
        }));
      })

      .catch ((e) => {
        // Set state error message to display on modal 
        // ensure user's tokens are reset (from the server not from here)
      })

      
    }
  }


if (!user_id)
  return (
<Login SERVER_URL = {SERVER_URL} loggedIn = {loggedIn}></Login>
)

if (results)
return (
  <Results explore = {explore} bookmark = {bookmark} bookmarks = {bookmarks} results = {results} setResults = {setResults}></Results>
)

return (
  <div style = {{padding: "10px"}}>
    <div style = {{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '10px', alignItems: 'center', justifyContent: 'center'}}>
      <AccountPanel setResults = {setResults} user_id = {user_id}></AccountPanel>
      <SearchPanel  setResults = {setResults} SERVER_URL = {SERVER_URL}></SearchPanel>
      <SavedPanel   setResults = {setResults} bookmark = {bookmark} bookmarks = {bookmarks} explore = {explore}></SavedPanel>
    </div>
  </div>
);

};


export default Main;
