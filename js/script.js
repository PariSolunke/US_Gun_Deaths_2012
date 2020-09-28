





  d3.json('top.json').then(function(us) 
  {
    

  var
  width=900,height=515,
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
        states.features[j].properties.age1 = data[i].age1; 
        states.features[j].properties.age2 = data[i].age2; 
        states.features[j].properties.age3 = data[i].age3; 
        break;
        }
        
      }
      
    }});
      

var colors = d3.scaleLinear()
  .domain([0, 15])
  .range(['#CCCCCC','#000000']);


setTimeout(() => {
  var tempCol,tempOpc,curType,children=0;
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
  var svg = d3.selectAll("#viz").insert("svg",":first-child")
  .attr("width", '73%')
  .attr("height", height)
  .style("margin","0%")
  .style("margin-right","2.5%")
  .style("margin-top","35")
  
  .style("background",'#fcfce3')
  .on("click", stopped, true);

d3.selectAll("#side").style("visibility","visible");



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
    return colors(d.properties.ratem) ;
    }
    
)
.on('mouseover', function(d) {
  tooltip.transition().duration(200)
    .style('opacity', .75)
    .style('pointer-events', 'none')

  tooltip.html(
    '<div style="font-weight: bold">' +'State: '+d.properties.name+'<br>Total Victims: '+d.properties.total+
     '<br>Males: '+ d.properties.males + '<br>Females: '+d.properties.females + '<br>Aged <10: '+d.properties.age1+ '<br>Aged 13-17: '+d.properties.age2+ '<br>Aged 18+: '+d.properties.age3+     '</div>'
  )
    .style('left', (d3.event.pageX +70) + 'px')
    .style('top', (d3.event.pageY -50) + 'px');
  
    if(active.node() != this)
    {
    tempOpc = this.style.opacity; 
    d3.select(this)
    .style('opacity', '0.5');
    }
  
    
})
.on('mouseout', function(d) {
  tooltip.html('')
  
  if(active.node() != this)
    {
   d3.select(this)
    .style('opacity', tempOpc)}
    else{

      d3.select(this)
    .style('opacity', '0.3')
    }
});





    
  
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
        if((d.total)<20)
        return 1.2;
        else if((d.total)<50)
        return 3;
        else if((d.total)<200)
        return 5.5;
        else if((d.total)<300)
        return 8.5;
        else
        return 9.5;
      })
        .style("fill", "#DC3220")	
        .style("opacity", '0.7')
        .on("click",comparison)
        .on('mouseover', function(d) {
          
          tooltip.transition().duration(200)
            .style('opacity', .9)
            .style('pointer-events', 'none')
        
          tooltip.html(
            '<div style="font-size: 0.8rem; font-weight: bold">' +'City: '+d.city+'<br>Total Victims: '+d.total+
             '<br>Males: '+ d.males + '<br>Females: '+d.females +'<br>Aged <10: '+d.age1+ '<br>Aged 13-17: '+d.age2+ '<br>Aged 18+: '+d.age3+'</div>'
          )
            .style('left', (d3.event.pageX +50) + 'px')
            .style('top', (d3.event.pageY -30) + 'px')
          
          d3.select(this)
            .style('opacity', '1')
        })
        .on('mouseout', function(d) {
          tooltip.html('')
          d3.select(this)
            .style('opacity', '0.7')
        });	
      });


      function comparison(d)
      { 
        var frame = d3.select('#side').attr('class', 'frame');
        var fw = frame.style("width").replace("px", "");
        var margin = {top: 5, right: 0, bottom: 18, left: 28}
        ,widthsvg = fw - margin.left - margin.right,
        heightsvg = 230 - margin.top - margin.bottom;
        var roughdata=[["Males",d.males],["Females",d.females],["Children",d.age1],["Teens",d.age2],["Adults",d.age3]];
        var plotdata = roughdata.map(function(d) {
          return {
             Category: d[0],
             Number: d[1]
          };
          
      });
     
            
       
        var sidesvg1,sidesvg2;
        if(children==0 || (children%2)==0)
        {
          if(children==0)
          {
          sidesvg1=d3.selectAll("#side")
          .html("")
          
          .append("svg")
          .attr("id","svg1")
          .attr("width",widthsvg+margin.left+margin.right)
          .attr("height",heightsvg+margin.top+margin.bottom)
          .style('margin', '0')
          .style('margin-bottom', '25')
          .style('background', '#fcfce3')
          .append("g");
          }
          else{
            d3.selectAll("#svg1").remove();

            sidesvg1=d3.selectAll("#side")
            .insert("svg",":first-child")
            .attr("id","svg1")
            .attr("width",widthsvg+margin.left+margin.right)
            .attr("height",heightsvg+margin.top+margin.bottom)
            .style('margin', '0')
            .style('margin-bottom', '25')
            .style('background', '#fcfce3')
            .append("g");

          }
          
            
          children++;
         
          var x = d3.scaleBand()
            .range([ margin.left, widthsvg ])
            .domain(plotdata.map(function(d) { return d.Category; }))
                .padding(0.1);
                
                
                
          sidesvg1.append("g")
          .attr("transform", "translate(0,"+(heightsvg+margin.top)+")")
            .call(d3.axisBottom(x))
            .selectAll("text")
                .attr("transform", "translate(14,0)")
                .style("text-anchor", "end");
           

// Add Y axis
          var y = d3.scaleLinear()
            .domain([0, 400])
            .range([ heightsvg, 0]);
            

        sidesvg1.append("g")
        .attr("transform", "translate("+margin.left+","+margin.top+")")
          .call(d3.axisLeft(y));

// Bars
sidesvg1.selectAll("mybar")
  .data(plotdata)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.Category); })
    .attr("y", function(d) { return y(d.Number); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return heightsvg+margin.top - y(d.Number); })
    .attr("fill", "#69b3a2");

    sidesvg1.append("text")
    .attr("x", (widthsvg/2+10) )
    .attr("y", 15)
    .style("text-anchor", "middle")
    .text(d.city);       
 
  }
        else if(children==1|| (children%2)==1)
        {
          if(children==1)
          {   
          sidesvg2=d3.selectAll("#side")
          .append("svg")
          .attr("id","svg2")
          .attr("width",widthsvg+margin.left+margin.right)
          .attr("height",heightsvg+margin.top+margin.bottom)
          .style('margin', '0')
          .style('background', '#fcfce3')
          .append("g")
          }
          else{
            d3.selectAll("#svg2").remove();

            sidesvg2=d3.selectAll("#side")
            .append("svg")
            .attr("id","svg2")
            .attr("width",widthsvg+margin.left+margin.right)
            .attr("height",heightsvg+margin.top+margin.bottom)
            .style('margin', '0')
            .style('background', '#fcfce3')
            .append("g");

          }
          
            
          children++;
          
         
          var x = d3.scaleBand()
            .range([ margin.left, widthsvg ])
            .domain(plotdata.map(function(d) { return d.Category; }))
                .padding(0.1);
                
                
                
          sidesvg2.append("g")
          .attr("transform", "translate(0,"+(heightsvg+margin.top)+")")
            .call(d3.axisBottom(x))
            .selectAll("text")
                .attr("transform", "translate(14,0)")
                .style("text-anchor", "end");
           

// Add Y axis
          var y = d3.scaleLinear()
            .domain([0, 400])
            .range([ heightsvg, 0]);
            

        sidesvg2.append("g")
        .attr("transform", "translate("+margin.left+","+margin.top+")")
          .call(d3.axisLeft(y));

// Bars
sidesvg2.selectAll("mybar2")
  .data(plotdata)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.Category); })
    .attr("y", function(d) { return y(d.Number); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return heightsvg+margin.top - y(d.Number); })
    .attr("fill", "#69b3a2");

    sidesvg2.append("text")
    .attr("x", (widthsvg/2+10) )
    .attr("y", 15)
    .style("text-anchor", "middle")
    .text(d.city); 

        }
      }

      function clicked(d) {
        if (active.node() == this) 
        {
          
          d3.select(this).transition().style("fill", tempCol).style("opacity", tempOpc);
          return reset();

        } 
       else if(active!=null)
        {
          d3.select(active.node()).transition().style("fill", tempCol).style("opacity",tempOpc);   
        }
        active.classed("active", false);
        
        active = d3.select(this).classed("active", true);
        
      
        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y];
            tempCol = this.style.fill;
            
            st.transition().style("fill", null);
           
            d3.select(this).transition().style("fill", "#005AB5").style("opacity",'0.3');
            
        svg.transition()
            .duration(750)
            // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
            .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4
      }
      
      function reset() {
        active.classed("active", false);
        active = d3.select(null);
        st.transition().style("fill", null);
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



