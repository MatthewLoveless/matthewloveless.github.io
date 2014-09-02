var margin = {top: 10, left: 10, bottom: 10, right: 10}
  , height = parseInt(d3.select('#map').style('height'))
  , height = height - margin.top - margin.bottom
  //, mapRatio = .8
  , width = parseInt(d3.select('#map').style('width'))
  , width = width - margin.left - margin.right
  ,scale
  ,centered;

var projection = d3.geo.albers()
    .center([1, 55.4])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(height * 5)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width + 'px')
    .attr("height", height + 'px');
                   
d3.json("uk.json", function(error, uk) {
     svg.selectAll(".subunit")
      .data(topojson.feature(uk, uk.objects.subunits).features)
      .enter().append("path")
      .attr("class", function(d) { return "subunit " + d.properties.name.replace(/\s+/g, '').toLowerCase(); })
      .attr("id", function(d) { return d.properties.name.replace(/\s+/g, '').toLowerCase(); })
      .attr("d", path)
      .on("click", clicked);
     svg.append("defs")
                  .append('pattern')
                    .attr('id', 'image')
                    .attr('width', '100%')
                    .attr('height', '100%')
                    .attr('patternContentUnits', 'objectBoundingBox')
                   .append("image")
                    .attr("xlink:href", "airport.svg")
                    .attr('width', 1)
                    .attr('height', 1)
                    .attr('preserveAspectRatio', 'none')
                    ;
    svg.selectAll(".irl")
      .data(topojson.feature(uk, uk.objects.irl).features)
      .enter().append("path")
      .attr("class", "irl")
      .attr("d", path);
     /*svg.append("path")
      .data(topojson.feature(uk, uk.objects.railways).features)
      .attr("class", "arc")
      .attr("d", path);

     svg.append("path")
      .data(topojson.feature(uk, uk.objects.railways).features)
      .attr("class", "cross")
      .attr("d", path);*/
     svg.append("path")
      .datum(topojson.feature(uk, uk.objects.heathrow))
      .attr("d", path.pointRadius(height * .02))
      .attr("class", "heathrow")
      .style("fill", "url(#image)");
     svg.append("path")
     /*svg.selectAll(".city")
           .data(topojson.feature(uk, uk.objects.cities).features)
           .attr("d", path.pointRadius(width * .01))
           .style("fill", "#ffffff")
           .attr("class", "city");
    svg.selectAll(".city-label")
      .data(topojson.feature(uk, uk.objects.cities).features)
      .enter().append("text")
      .attr("class", "city-label")
      //.attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
      .attr("x", function(d){
        return path.centroid(d)[0];
      })
      .attr("y", function(d){
        return path.centroid(d)[1];
      })
      .attr("dy", "-10px")
      //.append("textPath")
      //.attr("xlink:href", "#city")
      .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; })
      .style("font-family", "Arial")
      .text(function(d) { return d.properties.name; });*/  
  
});

d3.select(window).on('resize', resize);
$(function(){ resize(); });
      
      
function resize() {
    // adjust things when the window size changes
    d3.select("#connector").remove();

               d3.select("#connectorcircle").remove();
    height = parseInt(d3.select('#map').style('height'));
    height = height - margin.top - margin.bottom;
    width = parseInt(d3.select('#map').style('width'));
    width = width - margin.left - margin.right;
    containerWidth = $(window).width();
    scale = height * 5;
    /*restore if people want all of Ireland displayed
    if (containerWidth < 540 && height > 600) {
      scale = height * 4
    }
    */
    
      


    // update projection
    projection
    .center([1, 55.4])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(scale)
    .translate([width / 2, height / 2]);
    // resize the map container
    svg
        .style('width', width + 'px')
        .style('height', height + 'px');

    if (containerWidth > width) {
      svg.style('left', (containerWidth - width) / 2);
    } else {
      svg.style('left', 0);
    }
    // resize the map
    svg.selectAll('.subunit').attr('d', path);
    svg.selectAll('.irl').attr('d', path);
    svg.selectAll('.heathrow').attr('d', path.pointRadius(height * .02));
    /*svg.selectAll('.city').attr('d', path.pointRadius(width * .01));
    svg.selectAll('.arc').attr('d', path);
    svg.selectAll('.cross').attr('d', path);
    svg.selectAll('.city-label').attr('d', path).attr("x", function(d){
        return path.centroid(d)[0];
      })
      .attr("y", function(d){
        return path.centroid(d)[1];
      });*/


}
function clicked(d) {
  var x, y, k;
d3.select("#connector").remove();
  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = height * 5;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  svg.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });
//jsPlumb.Defaults.Container = $("#map");
  /*svg.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");*/
      var xPosition = d3.select(this).attr("x");
      var yPosition = d3.select(this).attr("y");
      //width conditional for mobile format
      if (parseInt(d3.select('#map').style('width')) > 560 && jQuery.browser.mobile == false) {

                //Update the tooltip position and value
            if (d.properties.side == 'right') {
                d3.select(".tooltip")
                  //Show the tooltip above where the mouse triggers the event
                  //.style("left", (d3.event.pageX - 40) + "px")     
                  //.style("top", (d3.event.pageY - 330) + "px")
                  .style("right", 20 + "px")     
                  .style("top", 20 + "px")
                  .style("left", null)     
                  .style("bottom", null)
                  .style('z-index', 1001)
                  .html(
                    '<input type="image" src="close.png" class="tooltipbutton" id="close" />' +
                    '<div>' +
                      '<h3>' + d.properties.name + '</h3>' +
                      '<img src="content-images/' + d.properties.image + '" alt="' + d.properties.name + '">' +
                      '<p>' + d.properties.paragraphs.join('</p><p>') + '</p>' +
                    '</div>'
                  );
                  d3.select("#tooltip").classed("hidden", false); 
                  var regionline = svg.append("svg:line")
                 .attr("x1", width - 235)
                .attr("y1", 50)
                .attr("x2", path.centroid(d)[0])
                .attr("y2", path.centroid(d)[1])
                .style("stroke", "#540084")
                .style("stroke-width", "5px")
                .style("stroke-linecap", "round")
                .attr("id", "connector");
                var regioncircle = svg.append("svg:circle")
                .attr("cx", path.centroid(d)[0])
                .attr("cy", path.centroid(d)[1])
                .style("stroke", "#540084")
                .style("fill", "#540084")
                .attr("r","6px")
                .attr("id", "connectorcircle");

                  }  
              if (d.properties.side == 'left') {
                d3.select(".tooltip")
                  //Show the tooltip above where the mouse triggers the event
                  //.style("left", (d3.event.pageX - 40) + "px")     
                  //.style("top", (d3.event.pageY - 330) + "px")
                  .style("left", 20 + "px")     
                  .style("bottom", 20 + "px")
                  .style("right", null)     
                  .style("top", null)
                  .style('z-index', 1001)
                  .html(
                    '<input type="image" src="close.png" class="tooltipbutton" id="close" />' +
                    '<div>' +
                      '<h3>' + d.properties.name + '</h3>' +
                      '<img src="content-images/' + d.properties.image + '" alt="' + d.properties.name + '">' +
                      '<p>' + d.properties.paragraphs.join('</p><p>') + '</p>' +
                    '</div>'
                  );
                  
                  d3.select("#tooltip").classed("hidden", false); 

                var regionline = svg.append("svg:line")
                 .attr("x1", 235)
                .attr("y1", height - parseInt(d3.select('#tooltip').style('height')))
                .attr("x2", path.centroid(d)[0])
                .attr("y2", path.centroid(d)[1])
                .style("stroke", "#540084")
                .style("stroke-width", "5px")
                .style("stroke-linecap", "round")
                .attr("id", "connector");
                var regioncircle = svg.append("svg:circle")
                .attr("cx", path.centroid(d)[0])
                .attr("cy", path.centroid(d)[1])
                .style("stroke", "#540084")
                .style("fill", "#540084")
                .attr("r","6px")
                .attr("id", "connectorcircle"); 

                  } 
                  
                  /*jsPlumb.connect({source:"tooltip", target:d.properties.name.replace(/\s+/g, '').toLowerCase(),paintStyle:{lineWidth:8, strokeStyle:'#540084',endpointStyle:'#540084'},
  anchors:["TopLeft", "Center"]});*/
                }
                //mobile tooltips
        if (parseInt(d3.select('#map').style('width')) <= 560 || jQuery.browser.mobile) {
          
         
          d3.select("#basic-modal-content")
                  //Show the tooltip above where the mouse triggers the event
                  //.style("left", (d3.event.pageX - 40) + "px")     
                  //.style("top", (d3.event.pageY - 330) + "px")
                  
                  .style('z-index', 1001)
                  .style("margin", "auto")
                  .style("max-width", null)

                  .html('<img src="close_small.png" width="80px" class="tooltipbutton">'
                    +
                    
                    '<div>' +
                      '<h3>' + d.properties.name + '</h3>' +
                      '<img class="regionimage" src="content-images/' + d.properties.image + '" alt="' + d.properties.name + '">' +
                      '<p>' + d.properties.paragraphs.join('</p><p>') + '</p>' +
                    '</div>'
                  );



            $('#basic-modal-content').modal({overlayClose: true});


        }

                //Show the tooltip
                

               
}
$("body").on("click", "input", function() {
    d3.select("#tooltip").classed("hidden", true);
    d3.selectAll("path").classed("active", false);
    d3.select("#connector").remove();
               d3.select("#connectorcircle").remove();

});

/*$("body").on("click", "div", function() { 
        if(!$('#tooltip').hasClass("hidden")) {
          alert("click");
               d3.select("#tooltip").classed("hidden", true);
               d3.selectAll("path").classed("active", false);
        }     
});*/
$(document).mouseup(function (e)
{
    var container = $(".svg");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
               d3.select("#tooltip").classed("hidden", true);
               d3.selectAll("path").classed("active", false);
               d3.select("#connector").remove();
               d3.select("#connectorcircle").remove();
             }
});