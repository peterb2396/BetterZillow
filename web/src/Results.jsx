import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Town from './Town';

const Results = (props) => {


  const [selectedStateGroup, setSelectedStateGroup] = useState(props.results[0]);
  const [dropdownTitle, setDropdownTitle] = useState(props.results[0]? props.results[0][0].State : null);

  const handleSelect = (eventKey) => {
    const selectedGroup = props.results.find(group => group[0].State === eventKey);
    setSelectedStateGroup(selectedGroup);
    setDropdownTitle(eventKey);
  };


  // Results
  return (
    // Column for header and results
    <div style={{ height: '95vh', display: 'flex', flexDirection: 'column', margin: "10px"}}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'fixed', width: '100vw', zIndex: 1000, paddingRight: "20px" }}>

        {/* Back to query */}
        <div style = {{display: 'flex', alignItems: 'center'}}>
          <p onClick = {() => {props.setResults(null)}} style = {{cursor: 'pointer', fontSize: '20px', margin: 0}}>{"<"}</p>
          <p style = {{margin: 0, fontSize: '20px', fontWeight: '100', marginLeft: "10px"}}> Back to Homepage</p>
        </div>

        {/* Change state selection */}
        {selectedStateGroup && (
            <div style = {{display: 'flex', alignItems: 'center'}}>
            <p style = {{margin: 0, marginRight: 5}}>Viewing matching cities in</p>
            <DropdownButton id="dropdown-basic-button" title={dropdownTitle} onSelect={handleSelect}>
                {props.results.map((stateGroup, index) => (
                <Dropdown.Item key={index} eventKey={stateGroup[0].State}>
                    {stateGroup[0].State}
                </Dropdown.Item>
                ))}
            </DropdownButton>
            </div>
        )}
        
      </div>

      <hr style = {{marginBottom: 0, marginTop: 50}}></hr>
      

      {/* Results, if results exist */}
      {selectedStateGroup && (
        <div style={{ marginTop: '10px', flex: 1, overflowY: 'auto'}}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px'}}>
            {selectedStateGroup.map((town, index) => (
                <div key={index}>
                <Town explored = {props.explored} explore = {props.explore} bookmark = {props.bookmark} bookmarks = {props.bookmarks} town={town}></Town>
                </div>
            ))}
            </div>
        </div>
      )}

      {!selectedStateGroup && (
        <div style = {{display: 'flex', justifyContent: 'center', height: "100%", alignItems: 'center'}}>

         <p style = {{fontWeight: 100, fontSize: 40}}>No towns found</p>
        </div>
      )}
      
    </div>
  );
}

export default Results;
