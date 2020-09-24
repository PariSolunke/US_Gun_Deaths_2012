





  d3.json('top.json').then(function(us) 
  {
    

  var
  width=1000,height=500,
  states = topojson.feature(us, us.objects.states),
  projection = d3.geoAlbersUsa(),
  path = d3.geoPath(projection);

  
  d3.csv("freq_by_state.csv").then(function(data) {
   
    
    // Load GeoJSON data and merge with states data
    
    
    // Loop through each state data value in the .csv file
    for (var i = 0; i < data.length; i++) {
      // Find the corresponding state inside the GeoJSON
      for (var j = 0; j < states.features.length; j++)  {
            
        if (data[i].name == states.features[j].properties.name) 
        {
        // Copy the data value into the JSON
        states.features[j].properties.rate = data[i].rate; 
        states.features[j].properties.ratem = data[i].ratem;  
        states.features[j].properties.ratef = data[i].ratef;
        states.features[j].properties.males = data[i].males; 
        states.features[j].properties.females = data[i].females; 
        states.features[j].properties.total = data[i].total; 
        break;
        }
        
      }
      
    }});
      

var colors = d3.scaleLinear()
  .domain([0, 15])
  .range(['#CCCCCC','#000000']);


setTimeout(() => {
  var tooltip = d3.select('body')
.append('div')
.style('position', 'absolute')
.style('padding', '0 10px')
.style('background', 'white')
.style('opacity', 0);


  var zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", zoomed);
  
  var active = d3.select(null);
  var svg = d3.selectAll("#viz").append("svg")
  .attr("width", 1300)
  .attr("height", height)
  .on("click", stopped, true);



var st= svg.append("g")


svg.call(zoom); // delete this line to disable free zooming
    // .call(zoom.event); // not in d3 v4


st.selectAll("path")
.data(states.features)
.enter()

.append("path")
.on("click", clicked)

.attr("d", path)
.attr("fill", (d) => {
      console.log(d.properties.rate);
    return colors(d.properties.rate) ;
    }
    
)
.on('mouseover', function(d) {
  tooltip.transition().duration(200)
    .style('opacity', .9)
    .style('pointer-events', 'none')

  tooltip.html(
    '<div style="font-weight: bold">' +'State:'+d.properties.name+'<br>Total Victims:'+d.properties.total+
     '<br>Males:'+ d.properties.males + '<br>Females: '+d.properties.females +'</div>'
  )
    .style('left', (d3.event.pageX +50) + 'px')
    .style('top', (d3.event.pageY -30) + 'px')
  tempColor = this.style.fill;
  d3.select(this)
    .style('fill', 'yellow')
})
.on('mouseout', function(d) {
  tooltip.html('')
  d3.select(this)
    .style('fill', tempColor)
});
;




    
  
  d3.csv("freq.csv").then( function(data) {

    st.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return projection([d.lng, d.lat])[0];
      })
      .attr("cy", function(d) {
        return projection([d.lng, d.lat])[1];
      })
      .attr("r", function(d) {
        if((d.males+d.females)<30)
        return 2.5;
        else if((d.males+d.females)<100)
        return 3.5;
        else if((d.males+d.females)<200)
        return 4.5;
        else if((d.males+d.females)<300)
        return 5.5;
        else
        return 6.5;
      })
        .style("fill", "rgb(217,91,67)")	
        .style("opacity", 0.60)
        .append("title")
      .text(d => d.city);	
      });

      function clicked(d) {
        if (active.node() === this) return reset();
        active.classed("active", false);
        active = d3.select(this).classed("active", true);
        
      
        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

            st.transition().style("fill", null);
            d3.select(this).transition().style("fill", "red");
        svg.transition()
            .duration(750)
            // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
            .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4
      }
      
      function reset() {
        active.classed("active", false);
        active = d3.select(null);
      
        svg.transition()
            .duration(750)
            // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
            .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
      }
      
      function zoomed() {
        st.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
        st.attr("transform", d3.event.transform); // updated for d3 v4
      }
      
      // If the drag behavior prevents the default click,
      // also stop propagation so we don’t click-to-zoom.
      function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
      }
      
       
      
    }, 1000);

  });
  

  
  
  
/*



  
/*
  map = d3.select('#viz').append('svg')
.attr('width', width + margin.left + margin.right)
.attr('height', height + margin.top + margin.bottom)

// add states from topojson
map.selectAll("path")
.data(states).enter()
.append("path")
.attr("class", "feature")
.style("fill", "steelblue")
.attr("d", path);

// put boarder around states 
map.append("path")
.datum(topojson.mesh(topo, topo.objects.states, function(a, b) { return a !== b; }))
.attr("class", "mesh")
.attr("d", path);
*/



  /*

var   tempColor,
    yScale,
    yAxisValues,
    yAxisTicks,
    yGuide,
    xScale,
    xAxisValues,
    xAxisTicks,
    xGuide,
    colors,
    tooltip,
    myChart;

for (var i = 0; i<d.list.length; i++) {
temperatures.push(d.list[i].main.temp);
dates.push( new Date(d.list[i].dt_txt) );
}

yScale = d3.scaleLinear()
.domain([0, d3.max(temperatures)])
.range([0,height]);

yAxisValues = d3.scaleLinear()
.domain([0, d3.max(temperatures)])
.range([height,0]);

yAxisTicks = d3.axisLeft(yAxisValues)
.ticks(10)

xScale = d3.scaleBand()
.domain(temperatures)
.paddingInner(.1)
.paddingOuter(.1)
.range([0, width])

xAxisValues = d3.scaleTime()
.domain([dates[0],dates[(dates.length-1)]])
.range([0, width])

xAxisTicks = d3.axisBottom(xAxisValues)
.ticks(d3.timeDay.every(1))

colors = d3.scaleLinear()
.domain([0, 65, d3.max(temperatures)])
.range(['#FFFFFF', '#2D8BCF', '#DA3637'])

tooltip = d3.select('body')
.append('div')
.style('position', 'absolute')
.style('padding', '0 10px')
.style('background', 'white')
.style('opacity', 0);

myChart = d3.select('#viz').append('svg')
.attr('width', width + margin.left + margin.right)
.attr('height', height + margin.top + margin.bottom)
.append('g')
.attr('transform',
  'translate(' + margin.left + ',' + margin.right + ')')
.selectAll('rect').data(temperatures)
.enter().append('rect')
  .attr('fill', colors)
  .attr('width', function(d) {
    return xScale.bandwidth();
  })
  .attr('height', 0)
  .attr('x', function(d) {
    return xScale(d);
  })
  .attr('y', height)
  
  .on('mouseover', function(d) {
    tooltip.transition().duration(200)
      .style('opacity', .9)
    tooltip.html(
      '<div style="font-size: 2rem; font-weight: bold">' +
        d + '&deg;</div>'
    )
      .style('left', (d3.event.pageX -35) + 'px')
      .style('top', (d3.event.pageY -30) + 'px')
    tempColor = this.style.fill;
    d3.select(this)
      .style('fill', 'yellow')
  })

  .on('mouseout', function(d) {
    tooltip.html('')
    d3.select(this)
      .style('fill', tempColor)
  });

yGuide = d3.select('#viz svg').append('g')
        .attr('transform', 'translate(20,0)')
        .call(yAxisTicks)

xGuide = d3.select('#viz svg').append('g')
        .attr('transform', 'translate(20,'+ height + ')')
        .call(xAxisTicks)

myChart.transition()
.attr('height', function(d) {
  return yScale(d);
})
.attr('y', function(d) {
  return height - yScale(d);
})
.delay(function(d, i) {
  return i * 20;
})
.duration(1000)
.ease(d3.easeBounceOut)

*/



