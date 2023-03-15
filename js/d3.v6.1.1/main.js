let FRAME_HEIGHT = 500;
let FRAME_WIDTH = 500;
let MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

let SCATTER_FRAME = d3.select('.scatter')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("id", "scatter");

// create scatter dimensions
let SCATTER_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
let SCATTER_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// Reading from file and appending points
d3.csv("data/Spotify_Songs_Subset.csv").then((data) => {
    
    // Getting max X and Y coords
    const MAX_X = d3.max(data, (d) => 
                                {return parseFloat(d.energy)});
                                
    const MAX_Y = d3.max(data, (d) => 
                                {return parseFloat(d.danceability)});
    // X coord scale function
    const X_SCALE = d3.scaleLinear()
                            .domain([(-MAX_X), (MAX_X)])
                            .range([0, SCATTER_WIDTH]);
    
    // Y coord scale function
    const Y_SCALE = d3.scaleLinear()
                        .domain([(-MAX_Y), (MAX_Y)])
                        .range([SCATTER_HEIGHT, 0]);

    // plot the scatter points
    let Points = SCATTER_FRAME.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", (d) => {return (X_SCALE(d.energy) + MARGINS.left)})
                .attr("cy", (d) => {return (MARGINS.top + (Y_SCALE(d.danceability)))})
                .attr("r", 1);


    
     // plot the bottom and side axis
     SCATTER_FRAME.append("g")
     .attr("transform", "translate(" + MARGINS.top + "," + 
     (SCATTER_HEIGHT/2 + MARGINS.top) + ")")
     .call(d3.axisBottom(X_SCALE).ticks(10))
         .attr("font-size", "12px");


    SCATTER_FRAME.append("g")
        .attr("transform", "translate("  +
         (SCATTER_WIDTH/2) +  ")")
        .call(d3.axisLeft(Y_SCALE).ticks(10))
            .attr("font-size", "12px");
});
                