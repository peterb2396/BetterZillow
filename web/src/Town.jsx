function Town({ town, bookmarks, bookmark, showState, explored, explore }) {
    const gotoZillow = () => {
        const formattedCity = town.City.replace(/ /g, '-').toLowerCase(); // Replace spaces with dashes
        const url = `https://www.zillow.com/homes/${formattedCity}-${town.id}/`;
        window.open(url, '_blank');
    };

    const clickHeart = (event) => {
        event.stopPropagation(); // Stop the click event from propagating to the outer div
        bookmark(town)
    };

    const clickStar = (event) => {
        event.stopPropagation(); // Stop the click event from propagating to the outer div
        explore(town)
    };

    return (
        <div style={{
            border: "1px solid black",
            borderRadius: "10px",
            height: "150px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column"
        }} onClick={gotoZillow}>

            <div style={{ padding: "5px", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: 100, fontSize: "20px", margin: 0 }}>{town.City}{showState? `, ${town.State}`: ""}</p>
                <div style = {{display: 'flex', gap: 5}}>
                    <img
                        onClick={clickStar}
                        width="25px"
                        height="25px"
                        alt="bookmark"
                        src={town.City + "-" + town.id in explored ? "StarYes.png" : "StarNo.png"}
                    />
                    <img
                        onClick={clickHeart}
                        width="25px"
                        height="25px"
                        alt="bookmark"
                        src={town.City + "-" + town.id in bookmarks ? "HeartYes.png" : "HeartNo.png"}
                    />
                </div>
                
            </div>

            <hr style={{ margin: 0 }} />

            {/* Holds the weather / population side by side */}
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: "10px", flexGrow: 1 }}>
                {/* Vertical container for the left half */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img width="23px" height="23px" alt="cold" src="cold.png" />
                        <p style={{ margin: 0 }}>{town['Minimum Temperature']}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img width="23px" height="23px" alt="hot" src="hot.png" />
                        <p style={{ margin: 0 }}>{town['Maximum Temperature']}</p>
                    </div>
                </div>

                {/* Vertical container for the right half */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img width="20px" height="20px" alt="population" src="population.png" />
                        <p style={{ margin: 0 }}>{town['Population']}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img width="20px" height="20px" alt="density" src="density.png" />
                        <p style={{ margin: 0 }}>{Math.round(town['Density'] * 2.59)}/mi²</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Town;
