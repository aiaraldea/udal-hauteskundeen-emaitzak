var aiaraldea = aiaraldea || {};
aiaraldea.hauteskundeak2015 = aiaraldea.hauteskundeak2015 || {};
aiaraldea.hauteskundeak2015.d3pie = (function (d3) {
  'use strict';


  var create = function (parent) {
    var component;
    component = d3.select(parent).append("div").attr("class", 'zinegotziak-d3pie');
    component = component.append("div").attr("class", 'zinegotziak-d3pie-inner')
            .style('height', '100%');

    var hide = function () {
      d3.select(component.node().parentNode).style('display', 'none');
//      component.remove();
    };



    var draw = function (dataset, title, colors) {
      d3.select(component.node().parentNode).style('display', 'block');
      var width = component.node().getBoundingClientRect().width;
      var height = component.node().getBoundingClientRect().height;
      
      var radius = Math.min(width, height * 2) / 2;
      var donutWidth = radius * .5;
      var color;
      if (typeof colors === 'undefined') {
        color = colors || d3.scale.category20b();
      } else {
        color = d3.scale.ordinal().range(colors);
      }
      component.selectAll("*").remove();
      var svg = component
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

      var tooltip = component
              .append('div')
              .style('position', 'absolute')
              .style('top', height * .5 + 'px')
              .style('left', width * .4 + 'px')
              .style('width', width * .2 + 'px')
              .attr('class', 'tooltip');

      tooltip.append('div')
              .attr('class', 'label');

      tooltip.append('div')
              .attr('class', 'count');

      tooltip.append('div')
              .attr('class', 'percent');

      var path = svg.selectAll('path')
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
              .style("font", "bold " + radius / 10 + "px Arial")
              .text(function (d) {
                return d.data.count;
              });

      /* OPTIONAL 
       path.on('mousemove', function(d) {                            
       tooltip.style('top', (d3.event.pageY + 10) + 'px')          
       .style('left', (d3.event.pageX + 10) + 'px');             
       });                                                           
       */
      svg.append("text")
              .attr("x", 0)
              .attr("y", 1 - (height * 0.1))
              .attr("text-anchor", "middle")
              .style("font-size", radius / 10 + "px")
              .style("font-weight", "bold")
              .style("fill", "#aaa")
              .text(title);
//            .call(wrap, 130);
    };
    function wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
//                        words = "Foo is not a long word".split(/\s+/).reverse(),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                x = text.attr("x"),
                y = text.attr("y"),
                dy = 0, //parseFloat(text.attr("dy")),
                tspan = text.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", parseInt(y) - words.length * 12)
                .attr("dy", dy + "em");
        var wordsLength = words.length;
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan")
                    .attr("x", x)
                    .attr("y", parseInt(y) - wordsLength * 12)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
          }
        }
      });
    }

    return {draw: draw, hide: hide};
  };

  return {create: create};
})(window.d3);