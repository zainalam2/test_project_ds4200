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

    const zoom = d3.zoom()
    .scaleExtent([1, 10]) // Set the minimum and maximum zoom levels
    .on("zoom", zoomed);

    // plot the scatter points
    let Points = SCATTER_FRAME.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", (d) => {return (X_SCALE(Math.abs(parseFloat(d.loudness))) + 2 * MARGINS.left)})
                .attr("cy", (d) => {return ((Y_SCALE(Math.abs(parseFloat(d.acousticness))) + MARGINS.top))})
                .attr("r", 1)
                .attr("id", (d) => {return (d.track_name)});
                .attr("class", "point");
                .style("opacity", 0.5)
                // .style("fill", (d) => {return (console.log((Math.abs(parseFloat(d.loudness))) + parseFloat(d.acousticness))).toString(16)});

    // add brushing 
    SCATTER_FRAME.call(d3.brush()                 
    .extent([[0,0], [FRAME_WIDTH, FRAME_HEIGHT]]) 
    .on("start brush", displayBrush)); 

    // add zooming
    SCATTER_FRAME.call(zoom)
    
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



 

    function zoomed() {
        // update the X and Y scale domains based on the zoom event
        X_SCALE.domain([MIN_X, MAX_X].map(d => d3.event.transform.applyX(d)));
        Y_SCALE.domain([MIN_Y, MAX_Y].map(d => d3.event.transform.applyY(d)));
  
        // check if any points are selected
        let selectedPoints = Points.filter(".selected");
        if (selectedPoints.size()) {
         // if there are selected points, zoom in on them
         let xExtent = d3.extent(selectedPoints.data(), d => Math.abs(parseFloat(d.loudness)));
         let yExtent = d3.extent(selectedPoints.data(), d => Math.abs(parseFloat(d.acousticness)));
         let xRange = [X_SCALE(xExtent[0]), X_SCALE(xExtent[1])];
         let yRange = [Y_SCALE(yExtent[1]), Y_SCALE(yExtent[0])];
         let xScaleFactor = SCATTER_WIDTH / (xRange[1] - xRange[0]);
         let yScaleFactor = SCATTER_HEIGHT / (yRange[1] - yRange[0]);
         let scaleFactor = Math.min(xScaleFactor, yScaleFactor, 10);
         let xTranslate = -xRange[0] * scaleFactor + MARGINS.left;
         let yTranslate = -yRange[0] * scaleFactor + MARGINS.top;
         SCATTER_FRAME.transition()
             .duration(500)
             .call(zoom.transform, d3.zoomIdentity.scale(scaleFactor).translate(xTranslate, yTranslate));
        }
    };

    

    // shows the brushing
    function displayBrush(event) {
        selection = event.selection;
        Points.classed("selected", function(d){ return isSelected(selection, (X_SCALE(Math.abs(parseFloat(d.loudness))) + 2 * MARGINS.left), ((Y_SCALE(Math.abs(parseFloat(d.acousticness))) + MARGINS.top)); })
        zoomed()

    };

      // when selecting a point to be brushed
      function isSelected(coords, cx, cy) {
        let x0 = coords[0][0],
            x1 = coords[1][0],
            y0 = coords[0][1],
            y1 = coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
      };
    

});

    
