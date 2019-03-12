var aiaraldea = aiaraldea || {};
aiaraldea.hauteskundeak2015 = aiaraldea.hauteskundeak2015 || {};
aiaraldea.hauteskundeak2015.d3pie = (function (d3) {
  'use strict';


  var draw = function (selector, dataset, title, colors) {
    var width = d3.select(selector).node().getBoundingClientRect().width;
    var height = d3.select(selector).node().getBoundingClientRect().height;
    var radius = Math.min(width, height * 2) / 2;
    var donutWidth = radius * .5;
    var color;
    if (typeof colors === 'undefined') {
      color = colors || d3.scale.category20b();
    } else {
      color = d3.scale.ordinal().range(colors);
    }
    d3.select(selector).selectAll("*").remove();
    var svg = d3.select(selector)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) +
                    ',' + (height) + ')');

    var arc = d3.svg.arc()
            .innerRadius(radius - donutWidth)
            .outerRadius(radius);

    var pie = d3.layout.pie()
            .startAngle(-Math.PI / 2)
            .endAngle(+Math.PI / 2)
            .value(function (d) {
              return d.count;
            })
            .sort(null);

    var path = svg.selectAll('path')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d, i) {
              return color(d.data.label);
            });

    // Select all <g> elements with class slice (there aren't any yet)
    var arcs = svg.selectAll("g.slice")
            // Associate the generated pie data (an array of arcs, each having startAngle,
            // endAngle and value properties) 
            .data(pie(dataset))
            // This will create <g> elements for every "extra" data element that should be associated
            // with a selection. The result is creating a <g> for every object in the data array
            .enter()
//      // Create a group to hold each slice (we will have a <path> and a <text>
//      // element associated with each slice)
            .append("svg:g")
            .attr("class", "slice");    //allow us to style things in the slices (like text)


// Add a magnitude value to the larger arcs, translated to the arc centroid and rotated.
    arcs.filter(function (d) {
      return d.endAngle - d.startAngle > .1;
    }).append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
            .attr("transform", function (d) { //set the label's origin to the center of the arc
              //we have to make sure to set these before calling arc.centroid
              d.outerRadius = radius; // Set Outer Coordinate
              d.innerRadius = radius / 2; // Set Inner Coordinate
              return "translate(" + arc.centroid(d) + ")";
            })
            .style("fill", "#fff")
            .style("font-size", radius / 10 + "px")
            .style("font-weight", "bold")
            .style("font-family", "sans-serif")
            .text(function (d) {
              return d.data.count;
            });

    svg.append("text")
            .attr("x", 0)
            .attr("y", 1 - (height * 0.1))
            .attr("text-anchor", "middle")
            .style("font-size", radius / 10 + "px")
            .style("font-weight", "bold")
            .style("font-family", "sans-serif")
            .style("fill", "#aaa")
            .text(title);
//            .call(wrap, 130);
  };

  return {draw: draw};
})(window.d3);