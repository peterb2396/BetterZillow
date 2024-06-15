function Town({town})
{
    const gotoZillow = () => {
        const formattedCity = town.City.replace(/ /g, '-').toLowerCase(); // Replace spaces with dashes
        const url = `https://www.zillow.com/homes/${formattedCity}-${town.id}/`;
        window.open(url, '_blank');
      };

    return (
        <div style = {{
            border: "1px solid black",
            borderRadius: "10px",
            height: "150px",
            cursor: "pointer"
        }} onClick={() => {gotoZillow()}}>
            <p style = {{margin: "5px", fontWeight: 100, fontSize: "20px"}}>{town.City}</p>
            <hr></hr>
            {/* Holds the weather / population side by side */}
            <div style = {{display: 'flex', justifyContent: 'space-between', margin: "10px"}}>

                {/* Vertical container for the left half*/}
                <div style = {{display: 'flex', flexDirection: 'column'}}>
                    <div style = {{display: 'flex', alignItems: 'center' }}>
                        <img width = "23px" height= "23px" alt = "cold" src = "cold.png"></img>
                        <p style={{ margin: 0 }}> {town['Minimum Temperature']}</p>
                    </div>

                    <div style = {{display: 'flex', alignItems: 'center' }}>
                        <img width = "23px" height= "23px" alt = "cold" src = "hot.png"></img>
                        <p style={{ margin: 0 }}>{town['Maximum Temperature']}</p>
                    </div>
                </div>

                {/* Vertical container for the right half*/}
                <div style = {{display: 'flex', flexDirection: 'column'}}>
                    <div style = {{display: 'flex', alignItems: 'center' }}>
                        <img width = "20px" height= "20px" alt = "cold" src = "population.png"></img>
                        <p style={{ margin: 0 }}> {town['Population']}</p>
                    </div>

                    <div style = {{display: 'flex', alignItems: 'center' }}>
                        <img width = "20px" height= "20px" alt = "cold" src = "density.png"></img>
                        <p style={{ margin: 0 }}>{Math.round(town['Density'] * 2.59)}/mi²</p>
                    </div>
                </div>
            </div>
            

        </div>
    )
}
export default Town