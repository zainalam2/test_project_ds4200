let FRAME_HEIGHT = 700;
let FRAME_WIDTH = 700;
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
                                {return parseFloat(d.loudness)});
                                
    const MAX_Y = d3.max(data, (d) => 
                                {return parseFloat(d.danceability)});

    // Getting max X and Y coords
    const MIN_X = d3.min(data, (d) => 
                                {return parseFloat(d.loudness)});
                                
    const MIN_Y = d3.min(data, (d) => 
                                {return parseFloat(d.danceability)});

    console.log(MAX_X)
    console.log(MIN_X)
    console.log(MAX_Y)
    console.log(MIN_Y)
    // X coord scale function
    const X_SCALE = d3.scaleLinear()
                            .domain([0, (MAX_X)])
                            .range([SCATTER_WIDTH/2, SCATTER_WIDTH]);

    const X_SCALE2 = d3.scaleLinear()
                        .domain([(-MAX_X), (MAX_X)])
                        .range([(MIN_X), SCATTER_WIDTH]);
    
    // Y coord scale function
    const Y_SCALE = d3.scaleLinear()
                        .domain([0, (MAX_Y)])
                        .range([SCATTER_HEIGHT/2, 0]);

    const Y_SCALE2 = d3.scaleLinear()
                        .domain([(-MAX_Y), (MAX_Y)])
                        .range([(SCATTER_HEIGHT), 0]);

    // plot the scatter points
    let Points = SCATTER_FRAME.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", (d) => {return (X_SCALE(d.loudness) + MARGINS.left + 1)})
                .attr("cy", (d) => {return ((Y_SCALE(d.danceability)) + MARGINS.top)})
                .attr("r", 1)
                .attr("id", (d) => {return (d.track_name)});


    
     // plot the bottom and side axis
      SCATTER_FRAME.append("g")
     .attr("transform", "translate(" + (MARGINS.left) + "," + 
     (SCATTER_HEIGHT/2 + MARGINS.top) + ")")
     .call(d3.axisBottom(X_SCALE2).ticks(10))
         .attr("font-size", "12px");

    

    SCATTER_FRAME.append("g")
        .attr("transform", "translate("  + (SCATTER_WIDTH/2 + MARGINS.left) + "," + 
        (MARGINS.top)+  ")")
        .call(d3.axisLeft(Y_SCALE2).ticks(10))
            .attr("font-size", "12px");
    

});


    