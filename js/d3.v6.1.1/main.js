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
    let keys = {'A' : 'blue', 'A#/Bb' : 'mediumturquiose', 
    'B' : 'green', 'C' : 'orange', 'C#/Db' : 'coral', 
    'D' : 'red', 'D#/Eb' : 'magenta', 'E' : 'violet', 
    'F' : 'brown', 'F#/Gb' : 'tomato', 'G' : 'pink', 'G#/Ab' : 'mediumslateblue'}

    // Getting max X and Y coords
    const MAX_X = d3.max(data, (d) => 
                                {return Math.abs(parseFloat(d.loudness))});
                                
    const MAX_Y = d3.max(data, (d) => 
                                {return Math.abs(parseFloat(d.acousticness))});

    // Getting max X and Y coords
    const MIN_X = d3.min(data, (d) => 
                                {return  Math.abs(parseFloat(d.loudness))});
                                
    const MIN_Y = d3.min(data, (d) => 
                                {return Math.abs(parseFloat(d.acousticness))});

    console.log(MAX_X)
    console.log(MIN_X)
    console.log(MAX_Y)
    console.log(MIN_Y)
    // X coord scale function
    const X_SCALE = d3.scaleLinear()
                            .domain([0, MAX_X])
                            .range([0, SCATTER_WIDTH]);

    
    // Y coord scale function
    const Y_SCALE = d3.scaleLinear()
                        .domain([0, MAX_Y])
                        .range([SCATTER_HEIGHT, 0]);

  

    // plot the scatter points
    let Points = SCATTER_FRAME.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", (d) => {return (X_SCALE(Math.abs(parseFloat(d.loudness))) + 2 * MARGINS.left)})
                .attr("cy", (d) => {return ((Y_SCALE(Math.abs(parseFloat(d.acousticness))) + MARGINS.top))})
                .attr("r", 1)
                .attr("id", (d) => {return (d.track_name)});
                // .style("fill", (d) => {return (console.log((Math.abs(parseFloat(d.loudness))) + parseFloat(d.acousticness))).toString(16)});


    
     // plot the bottom and side axis
      SCATTER_FRAME.append("g")
     .attr("transform", "translate(" + (2 * MARGINS.left) + "," + 
     (SCATTER_HEIGHT + MARGINS.top) + ")")
     .call(d3.axisBottom(X_SCALE).ticks(10))
         .attr("font-size", "12px");

    

    SCATTER_FRAME.append("g")
        .attr("transform", "translate("  + (2 * MARGINS.left) + "," + 
        (MARGINS.top) +  ")")
        .call(d3.axisLeft(Y_SCALE).ticks(10))
            .attr("font-size", "12px");
    

});


    