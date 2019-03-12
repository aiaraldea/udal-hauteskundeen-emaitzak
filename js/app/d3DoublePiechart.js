var aiaraldea = aiaraldea || {};
aiaraldea.hauteskundeak2015 = aiaraldea.hauteskundeak2015 || {};
aiaraldea.hauteskundeak2015.d3DoublePie = (function (d3) {
  'use strict';


  var create = function (parent) {
    var component;
    component = d3.select(parent).append("div").attr("class", 'zinegotziak-d3dpie');
    component = component.append("div").attr("class", 'zinegotziak-d3dpie-inner')
            .style('height', '100%');

    var hide = function () {
      d3.select(component.node().parentNode).style('display', 'none');
//      component.remove();
    };

    var draw = function (title, datasetCurrent, colorsCurrent, datasetPrevious, colorsPrevious, _zenbatua) {
      if (_zenbatua == null)
        var zenbatua = 100;
      else
        var zenbatua = _zenbatua;
      d3.select(component.node().parentNode).style('display', 'block');
      var width = component.node().getBoundingClientRect().width;
      var height = component.node().getBoundingClientRect().height;

      var radius = Math.min(width, (height * 0.9) * 2) / 2;
      component.selectAll("*").remove();

      var svg = component
              .append('svg')
              .attr('width', width)
              .attr('height', height);
      var graph = svg
              .append('g')
              .attr('transform', 'translate(' + (width / 2) +
                      ',' + (height * 0.9) + ')');

      var zenbatuaLegend = svg
              .append('g');
//      zenbatuaLegend.append("text")
//              .attr("x", width * 0.95)
//              .attr("y", (height * 0.12))
//              .attr("text-anchor", "end")
//              .style("font-size", radius / 10 + "px")
//              .style("font-weight", "bold")
//              .style("fill", "#aaa")
//              .text('%' + zenbatua);
//      zenbatuaLegend.append("text")
//              .attr("x", width * 0.95)
//              .attr("y", (height * 0.05))
//              .attr("text-anchor", "end")
//              .style("font-size", radius / 20 + "px")
//              .style("font-weight", "bold")
//              .style("fill", "#666")
//              .text('zenbatua:');
      var dateLegend = svg
              .append('g')
              .attr('transform', 'translate(0,' + (height) + ')');
      dateLegend.append('svg:text').
              text('2015')
              .attr("x", width / 2 - radius * 0.8)
              .attr("y", 0 - (height * 0.03))
              .attr("text-anchor", "middle")
              .style("font-size", radius / 10 + "px")
              .style("font-weight", "bold")
              .style("fill", "#aaa");
      dateLegend.append('svg:text').
              text('2011')
              .attr("x", width / 2 - radius * 0.6 * 0.8)
              .attr("y", 0 - (height * 0.05))
              .attr("text-anchor", "middle")
              .style("font-size", radius / 20 + "px")
              .style("font-weight", "bold")
              .style("fill", "#aaa");

      var tooltip = component
              .append('div')
              .style('position', 'absolute')
              .style('top', height * .8 + 'px')
              .style('left', width * .38 + 'px')
              .style('width', width * .2 + 'px')
              .attr('class', 'tooltip');

      tooltip.append('div')
              .attr('class', 'label');

      tooltip.append('div')
              .attr('class', 'count');

      tooltip.append('div')
              .attr('class', 'percent');

      var drawPie = function drawPie(dataset, colors, fradius, clazz) {

        var donutWidth = fradius * .4;
        var color;
        if (typeof colors === 'undefined') {
          color = d3.scale.category20b();
        } else {
          color = d3.scale.ordinal().range(colors);
        }

        graph.append("g").attr('class', clazz);
        var arc = d3.svg.arc()
                .innerRadius(fradius - donutWidth)
                .outerRadius(fradius);

        var pie = d3.layout.pie()
                .startAngle(-Math.PI / 2)
                .endAngle(+Math.PI / 2)
                .value(function (d) {
                  return d.count;
                })
                .sort(null);

        var path = graph.select('g.' + clazz).selectAll(path)
                .data(pie(dataset))
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', function (d, i) {
                  return color(d.data.label);
                });



        path.on('mouseover', function (d) {
          var total = d3.sum(dataset.map(function (d) {
            return d.count;
          }));
          var percent = Math.round(1000 * d.data.count / total) / 10;
          tooltip.select('.label').html(d.data.label);
          tooltip.select('.count').html(d.data.count);
          tooltip.select('.percent').html(percent + '%');
          tooltip.style('display', 'block');
        });

        path.on('mouseout', function () {
          tooltip.style('display', 'none');
        });

        // Select all <g> elements with class slice (there aren't any yet)
        var arcs = graph.select('g.' + clazz).selectAll("g.slice")
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
                .attr("dy", ".65em")
                .attr("text-anchor", "middle")
                //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
                .attr("transform", function (d) { //set the label's origin to the center of the arc
                  //we have to make sure to set these before calling arc.centroid
                  d.outerRadius = fradius; // Set Outer Coordinate
                  d.innerRadius = fradius / 2; // Set Inner Coordinate
                  return "translate(" + arc.centroid(d) + ")";
                })
                .style("fill", "#fff")
                .style("font", "bold " + fradius / 10 + "px Arial")
                .text(function (d) {
                  return d.data.count;
                });
        arcs.filter(function (d) {
          return d.endAngle - d.startAngle > .1;
        }).append("svg:text")
                .attr("dy", "-.25em")
                .attr("text-anchor", "middle")
                //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
                .attr("transform", function (d) { //set the label's origin to the center of the arc
                  //we have to make sure to set these before calling arc.centroid
                  d.outerRadius = fradius; // Set Outer Coordinate
                  d.innerRadius = fradius / 2; // Set Inner Coordinate
                  return "translate(" + arc.centroid(d) + ")";
                })
                .style("fill", "#ddd")
//                .style("stroke", "#aaa")
//                .style("stroke-width", fradius / 400 + "px")
                .style("font", function (d) {
                  var smallLabelFactor = 1;
                  if (d.data.label.length > 10) {
                    smallLabelFactor = 0.75;
                  }
                  return "bold " + fradius / 14 * smallLabelFactor + "px Arial";
                })
                .text(function (d) {
                  return d.data.label;
                });

        /* OPTIONAL 
         path.on('mousemove', function(d) {                            
         tooltip.style('top', (d3.event.pageY + 10) + 'px')          
         .style('left', (d3.event.pageX + 10) + 'px');             
         });                                                           
         */
      };

      drawPie(datasetPrevious, colorsPrevious, radius * .58, 'p1');
      drawPie(datasetCurrent, colorsCurrent, radius, 'p2');

      graph.append("text")
              .attr("x", 0)
              .attr("y", 0 - (height * 0.03))
              .attr("text-anchor", "middle")
              .style("font-size", radius / 10 + "px")
              .style("font-weight", "bold")
              .style("fill", "#aaa")
              .text(title);
    };


    return {draw: draw, hide: hide};
  };

  return {create: create};
})(window.d3);