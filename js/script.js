





  d3.json('top.json').then(function(us) 
  {
    

  var
  width=1200,height=700,
  states = topojson.feature(us, us.objects.states),
  projection = d3.geoAlbersUsa(),
  path = d3.geoPath(projection);

  
  console.log(states.features[i].properties.name);
  
  var svg = d3.selectAll("#viz").append("svg")
  .attr("width", 1300)
  .attr("height", height)
  .on("click", reset);

var st= svg.append("g")
.append("g")

.attr("cursor", "pointer")
.selectAll("path")
.data(states.features)
.attr("fill", "#444")
.join("path")
.on("click", clicked)
.attr("d", path);

st.append("title")
      .text(d => d.properties.name);





  /*
  var svg = d3.selectAll("#viz").append("svg")
    				.attr("width", 1300)
            .attr("height", height);
           
          

            svg.selectAll('path').remove();
	// add states from topojson
	svg.selectAll('.states')
  .data(states.features)
  .join('path')
  .attr('d', f => path(f))
  .attr('stroke', 'grey')
  .attr('fill', 'none')
  .attr('stroke-width', 1);
*/
    
  
  d3.csv("freq.csv").then( function(data) {

    svg.selectAll("circle")
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
        return 2;
        else if((d.males+d.females)<100)
        return 3.15;
        else if((d.males+d.females)<200)
        return 4.3;
        else if((d.males+d.females)<300)
        return 5.5;
        else
        return 8;
      })
        .style("fill", "rgb(217,91,67)")	
        .style("opacity", 0.60)
        .append("title")
      .text(d => d.city);	
      });

  
      function reset() {
        st.transition().style("fill", null);
        svg.transition().duration(750).call(
          zoom.transform,
          d3.zoomIdentity,
          d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
      }

        function clicked(event, d) {
          var [[x0, y0], [x1, y1]] = path.bounds(d);
          d3.event.stopPropagation();
          st.transition().style("fill", null);
          d3.select(this).transition().style("fill", "blue");
          
        }
      
        
      


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



