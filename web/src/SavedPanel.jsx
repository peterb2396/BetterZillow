
import Town from "./Town";
const SavedPanel = (props) => {

  //const SERVER_URL = "http://localhost:3001"


  
  return (
    
      <div className="panel-container">
        <p style = {{fontWeight: 100, fontSize: 25, alignSelf: 'center'}}>Saved Cities</p>
        <div style = {{display: 'flex', flexDirection: 'column', height: "100%", gap: "10px", overflowY: 'auto'}}>
          {Object.values(props.bookmarks).map((town, index) => (
                  <div key={index}>
                    <Town explored = {props.explored} explore = {props.explore} bookmark = {props.bookmark} bookmarks = {props.bookmarks} town={town} showState = {true}></Town>
                  </div>
              ))}
        </div>
      </div>
  );

  
  
};

export default SavedPanel;
