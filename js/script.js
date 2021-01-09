d3.json('top.json').then(function(us) 
  {
    

    let box = document.querySelector('#container1');
    let width = 0.98*box.clientWidth;
  var height=700,
  states = topojson.feature(us, us.objects.states),
  projection = d3.geoAlbersUsa().fitSize([width, height], states),
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
  .domain([0, 10])
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
  .attr("width", width)
  .attr("height", height)
  .style("margin","0%")
  
  .style("background",'#fcfce3')
  .on("click", stopped, true);

d3.selectAll("#side").style("visibility","visible");



var st= svg.append("g")


svg.call(zoom); 


st.selectAll("path")
.data(states.features)
.enter()
.append("path")
.on("click", clicked)
.attr("d", path)
.attr("fill", (d) => {
    return colors(d.properties.rate) ;
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

dispLegend();


function dispLegend() {

  var colors = d3.scaleLinear()
  .domain([0, 10])
  .range(['#CCCCCC','#000000']);

  var legendWidth = 100,
      legendHeight = 600;

  var svg = d3.select("#viz>svg")
 
  var leg = svg.append("g")
    .append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradientLegend")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

  leg.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", colors(10))
      .attr("stop-opacity", 1);

  leg.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", colors(0))
      .attr("stop-opacity", 1);

  svg.append("rect")
      .attr("width", 30)
      .attr("height", legendHeight)
      .style("fill", "url(#gradientLegend)")
      .attr("transform", "translate(10,10)")

  var y = d3.scaleLinear()
      .range([legendHeight, 0])
      .domain([0, 10]);

  var yAxis = d3.axisRight(y);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(41,12)")
      .call(yAxis);

     allCities("all");


     d3.selectAll("input[name='type']").on("change", function(){
      if(this.value=="gender"){
        
     allCities("all");
      }
      else
      normCities();
  });
  d3.selectAll("select[name='Genders']").on("change", function()
  {
   if(this.value=="all")
    allCities("all");
    else if(this.value=="male")
    allCities("male");
    else if(this.value=="female")
    allCities("female");

  });


}

function normCities()
{
  d3.select('#genderlabel').style("visibility","hidden");
  d3.select('#genderselect').style("visibility","hidden");
  d3.selectAll("circle").remove();


  d3.csv("30cities.csv").then( function(data) {

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
        if((d.rate)<5)
        return 2;
        else if((d.rate)<15)
        return 4.5;
        else if((d.rate)<30)
        return 6.5;
        else if((d.rate)<40)
        return 8.2;
        else
        return 9;
      })
        .style("fill", "#DC3220")	
        .style("opacity", '0.9')
        .on("click",comparison)
        .on('mouseover', function(d) {
          
          tooltip.transition().duration(200)
            .style('opacity', .9)
            .style('pointer-events', 'none')
        
          tooltip.html(
            '<div style=" font-weight: bold">' +'City: '+d.city+'<br>RATE: '+d.rate+'<br>Total Victims: '+d.total+
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
  

}





    
function allCities(curFilter)
{
  d3.selectAll("circle").remove();

  d3.select('#genderlabel').style("visibility","visible");
  d3.select('#genderselect').style("visibility","visible");
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
        if(curFilter=="all")
       {
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
       }
       else if(curFilter=="male")
       {
        if((d.males)<20)
        return 1.2;
        else if((d.males)<50)
        return 3;
        else if((d.males)<200)
        return 5.5;
        else if((d.males)<300)
        return 8.5;
        else
        return 9.5;
       }
       else if(curFilter=="female")
       {
        if((d.females)<20)
        return 1.2;
        else if((d.females)<50)
        return 3;
        else if((d.females)<200)
        return 5.5;
        else if((d.females)<300)
        return 8.5;
        else
        return 9.5;
       }
      })
        .style("fill", "#DC3220")	
        .style("opacity", '0.7')
        .on("click",comparison)
        .on('mouseover', function(d) {
          
          tooltip.transition().duration(200)
            .style('opacity', .9)
            .style('pointer-events', 'none')
        
          tooltip.html(
            '<div style=" font-weight: bold">' +'City: '+d.city+'<br>Total Victims: '+d.total+
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
    }

      function comparison(d)
      { 
        let box2 = document.querySelector('#side');
        let fw = box2.clientWidth;
        var margin = {top: 5, right: 0, bottom: 18, left: 30}
        ,widthsvg = fw - margin.left - margin.right,
        heightsvg = 340 - margin.top - margin.bottom;
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
          .attr("width",widthsvg)
          .attr("height",heightsvg+margin.top+margin.bottom)
          .style('background', '#fcfce3')
          .append("g");
          }
          else{
            d3.selectAll("#svg1").remove();

            sidesvg1=d3.selectAll("#side")
            .insert("svg",":first-child")
            .attr("id","svg1")
            .attr("width",widthsvg)
            .attr("height",heightsvg+margin.top+margin.bottom)
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
          .attr("width",widthsvg)
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
            .attr("width",widthsvg)
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
      // also stop propagation so we donâ€™t click-to-zoom.
      function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
      }
      
       
      
    }, 1150);

  });
  

  
  
  
