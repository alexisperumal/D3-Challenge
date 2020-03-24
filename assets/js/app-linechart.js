// UCSD Data Science Bootcamp, HW16 D3
// Alexis Perumal, 3/22/20

// @TODO: YOUR CODE HERE!
// var svgWidth = 1000;
// var svgHeight = 500;


//From Kevin, 3/23/20 - START

// add before svg
// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));
// Designate the height of the graph
var height = width - width / 3.9;
// Margin spacing for graph
var margin = 20;
// space for placing words
var labelArea = 110;
// padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

//From Kevin, 3/23/20 - END



// create an SVG element
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// Load csv data
d3.csv("assets/data/data.csv").then(function(stateData) {

  console.log(stateData);

  // cast the data from the csv as numbers
  stateData.forEach(function(data) {
    data.id = +data.id;
    data.poverty = +data.poverty;
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;
    data.ageMoe = +data.ageMoe;
    data.income = +data.income;
    data.incomeMoe = +data.incomeMoe;
    data.healthcare = +data.healthcare;
    data.healthcareLow = +data.healthcareLow;
    data.healthcareHigh = +data.healthcareHigh;
    data.obesity = +data.obesity;
    data.obesityLow = +data.obesityLow;
    data.obesityHigh = +data.obesityHigh;
    data.smokes = +data.smokes;
    data.smokesLow = +data.smokesLow;
    data.smokesHigh = +data.smokesHigh;
  });

  // Create a scale for your independent (x) coordinates
  var xScale = d3.scaleLinear()
    .domain(d3.extent(stateData, d => d.id))
    .range([0, width]);

  // Create a scale for your dependent (y) coordinates
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.poverty)])
    .range([height, 0]);

  // create a line generator function and store as a variable
  // use the scale functions for x and y data
  var createLine = d3.line()
    .x(data => xScale(data.id))
    .y(data => yScale(data.poverty));

  // Append a path element to the svg, make sure to set the stroke, stroke-width, and fill attributes.
  svg.append("path")
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("fill", "none")
    .attr("d", createLine(stateData));

}).catch(function(error) {
  console.log(error);
});