// UCSD Data Science Bootcamp, HW16 D3
// Alexis Perumal, 3/22/20

// @TODO: YOUR CODE HERE!
// var svgWidth = 1000;
// var svgHeight = 500;


// //From Kevin, 3/23/20 - START

// // add before svg
// // Grab the width of the containing box
// var width = parseInt(d3.select("#scatter").style("width"));
// // Designate the height of the graph
// var height = width - width / 3.9;
// // Margin spacing for graph
// var margin = 20;
// // space for placing words
// var labelArea = 110;
// // padding for the text at the bottom and left axes
// var tPadBot = 40;
// var tPadLeft = 40;

// //From Kevin, 3/23/20 - END



// // create an SVG element
// var svg = d3
//   .select("#scatter")
//   .append("svg")
//   .attr("width", width)
//   .attr("height", height)
//   .attr("class", "chart");



// From Hair app.js (D3-Day03-Activity 12)
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(xData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(xData, d => d[chosenXAxis]) * 0.8,
      d3.max(xData, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);
  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  return circlesGroup;
}

// Todo: Insert function updateToolTip()
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
  var label;

  if (chosenXAxis === "poverty") {
    label = "In Poverty %:";
  } else if (chosenXAxis === "age") {
    label = "Age (Median):";
  } else {
    label = "Household Income (Median):"
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Load csv data
d3.csv("assets/data/data.csv").then(function(stateData, err) {
  if (err) throw err;

  // console.log(stateData);

  // cast the data from the csv as numbers
  stateData.forEach(function(data) {
    data.id = +data.id;
    data.poverty = +data.poverty; // x-axis opt. 1
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;  // x-axis opt. 2
    data.ageMoe = +data.ageMoe;
    data.income = +data.income;  // x-axis opt. 3
    data.incomeMoe = +data.incomeMoe;
    data.healthcare = +data.healthcare;  // y-axis opt. 3
    data.healthcareLow = +data.healthcareLow;
    data.healthcareHigh = +data.healthcareHigh;
    data.obesity = +data.obesity;  // y-axis opt. 1
    data.obesityLow = +data.obesityLow;
    data.obesityHigh = +data.obesityHigh;
    data.smokes = +data.smokes;  // y-axis opt. 2
    data.smokesLow = +data.smokesLow;
    data.smokesHigh = +data.smokesHigh;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d[chosenYAxis])])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "#89bdd3")  // Todo: Set this up in the .css file instead.
    .attr("opacity", ".75");

  // Create group for  2 x- axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var xPovertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var xAgeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var xIncomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obese (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          xPovertyLabel
            .classed("active", true)
            .classed("inactive", false);
          xAgeLabel
            .classed("active", false)
            .classed("inactive", true);
          xIncomeLabel
            .classed("active", false)
            .classed("inactive", true);
        } else if (chosenXAxis === "age") {
          xPovertyLabel
            .classed("active", false)
            .classed("inactive", true);
          xAgeLabel
            .classed("active", true)
            .classed("inactive", false);
          xIncomeLabel
            .classed("active", false)
            .classed("inactive", true);
        } else {  // "income"
          xPovertyLabel
            .classed("active", false)
            .classed("inactive", true);
          xAgeLabel
            .classed("active", false)
            .classed("inactive", true);
          xIncomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

}).catch(function(error) {
  console.log(error);
});