// UCSD Data Science Bootcamp, HW16 D3
// Alexis Perumal, 3/22/20

// ToDo in Priority Order: 
//  1. Add circle border on hover. - Not done.
//     See: https://stackoverflow.com/questions/51168981/d3-how-to-add-border-to-a-circle-on-an-if-condition
//  2. Update readme - in progress.
//
//
// DONE
//  1. Add 2-letter state abbreviations as a label. - DONE
//       See: https://stackoverflow.com/questions/13615381/d3-add-text-to-circle
//       Used: http://bl.ocks.org/ChrisJamesC/4474971
//  2. Fix y-axis label locations to be variable, not fixed. - DONE
//  3. Fix the y-axis itself to be positioned correctly, with data plotted correctly. - DONE
//  4. Fix tool tip bug where wrong data dimension is shown - DONE
//  5.  Fix bug where moving IDs keep the selected axis variable from being highlighted. - DONE
//  6. Fix bug where only states KY-WY have IDs that appear. - DONE
//  7. Clean up tool tip color/style. - DONE
//  8. Clean up state ID color/style. - DONE
//  9. Fix bug where state ID blocks the hover tooltip from appearing. - DEFER
//  10. Add y-value to tool tip label. - DONE
//  11. Confirm calculation for y-axis label location (low priority because it is working without issue) - DEFER
//  12. Refactor code so there is less redundant code! - DEFER


// Derived from Hair app.js (D3-Day03-Activity 12)
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

// console.log('svgWidth: ', svgWidth, ', margin.left: ', margin.left, ', margin.right: ', margin.right, ', width: ', width);
// console.log('svgHeight: ', svgHeight, ', margin.top: ', margin.top, ', margin.bottom: ', margin.bottom, ', height: ', height);

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
var chosenXAxis = "poverty";  // other options: age, income
var chosenYAxis = "obesity";  // other options: smokes, healthcare

// function used for updating x-scale var upon click on axis label
function xScale(xData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(xData, d => d[chosenXAxis]) * 0.9,
      d3.max(xData, d => d[chosenXAxis]) * 1.1])
    .range([0, width]);
  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(yData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(yData, d => d[chosenYAxis]) * 0.9,
      d3.max(yData, d => d[chosenYAxis]) * 1.1])
    .range([height, 0]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

// function used for updating xAxis var upon click on axis label
function renderYAxes(newScale, axis) {
  var baseAxis = d3.axisLeft(newScale);
  axis.transition()
    .duration(1000)
    .call(baseAxis);
  return axis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}

// function used for updating circles group with a transition to
// new circles
function renderStateIds(stateIdsGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  stateIdsGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]))
    .attr("dy", d => newYScale(d[chosenYAxis]-0.22));
  return stateIdsGroup;
}

// Todo: Insert function updateToolTip()
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  var label;

  if (chosenXAxis === "poverty") {
    labelX = "Poverty (%):";
  } else if (chosenXAxis === "age") {
    labelX = "Age (Median):";
  } else {
    labelX = "Household Income (Median):";
  }

  // var chosenYAxis = "obesity";  // other options: smokes, healthcare

  if (chosenYAxis === "obesity") {
    labelY = "Obese (%):";
  } else if (chosenYAxis === "smokes") {
    labelY = "Smokes (%):";
  } else {  // implies healthcare
    labelY = "Lacks Healthcare (%):";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.state}</strong><br>${labelX} ${d[chosenXAxis]}<br>${labelY} ${d[chosenYAxis]}`);
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
  var yLinearScale = yScale(stateData, chosenYAxis);

  // From Hair when there was just one y-axis option.
  // // Create y scale function
  // var yLinearScale = d3.scaleLinear()
  //   .domain([0, d3.max(stateData, d => d[chosenYAxis])])
  //   .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  // console.log('xLinearScale', xLinearScale);
  // console.log('yLinearScale', yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  // chartGroup.append("g")
  //   .call(leftAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, 0)`)
    .call(leftAxis);

  // console.log('stateData', stateData);

 
  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)  // Todo: move to a separate element grouped with circle.
    // .text(d => d.abbr)
    // .append("text")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]+0.22))
    .attr("r", 10)
    // .attr("fill", "#89bdd3")  // Todo: Set this up in the .css file instead.
    // .attr("fill", "green")  // Todo: Set this up in the .css file instead.
    .attr("opacity", ".8")
    .attr("class", d => ("stateCircle " + d.abbr));

  console.log('stateData', stateData);

  // Help from Grant who said that "text" has a limit and can't hold all the data.
  // var stateIdGroup = chartGroup.selectAll("text")
  var stateIdGroup = chartGroup.selectAll(null)
    .data(stateData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    // .text(d => {d.abbr; console.log('d.abbr', d.abbr);})
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]))
    .attr("font-size", 10)
    .attr("r", 10)
    // .attr("class", d => ("stateText " + d.abbr));
    .attr("class", "stateText");

  console.log('stateData', stateData);

  // Create group for  3 x- axis labels
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

      // Create group for  3 y- axis labels
  var yLabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var yObesityLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    // .attr("y", 0 - margin.left)
    // .attr("x", 0 - (height / 2))
    .attr("y", -500)
    .attr("x", 200)
    .attr("dy", "1em")
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("Obese (%)");

  var ySmokesLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -480)
    .attr("x", 200)
    .attr("dy", "1em")
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  var yHealthcareLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -460)
    .attr("x", 200)
    .attr("dy", "1em")
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");

  // // append y axis
  // chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left)
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "1em")
  //   .classed("axis-text", true)
  //   .text("Obese (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

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
      xAxis = renderXAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,
        yLinearScale, chosenYAxis);

      stateIdGroup = renderStateIds(stateIdGroup, xLinearScale, chosenXAxis,
        yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

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

  // y axis labels event listener
  yLabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;
      // console.log('chosenYAxis', chosenYAxis);
      // console.log('chosenXAxis', chosenXAxis);

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      yLinearScale = yScale(stateData, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,
        yLinearScale, chosenYAxis);

      stateIdGroup = renderStateIds(stateIdGroup, xLinearScale, chosenXAxis,
        yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "obesity") {
        yObesityLabel
          .classed("active", true)
          .classed("inactive", false);
        ySmokesLabel
          .classed("active", false)
          .classed("inactive", true);
        yHealthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      } else if (chosenYAxis === "smokes") {
        yObesityLabel
          .classed("active", false)
          .classed("inactive", true);
        ySmokesLabel
          .classed("active", true)
          .classed("inactive", false);
        yHealthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      } else {  // "healthcare"
        yObesityLabel
          .classed("active", false)
          .classed("inactive", true);
        ySmokesLabel
          .classed("active", false)
          .classed("inactive", true);
        yHealthcareLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });

}).catch(function(error) {
  console.log(error);
});