document.addEventListener("DOMContentLoaded",
   fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
      .then(response =>{return response.json()})
      .then(data => {
         const dataset = data;
         const w = 1000;
         const h = 500;
         const padding = 80;
         const rw = w/dataset.length;

         var xValues = dataset.map(d=>parseInt(d.Year));
         var yValues = dataset.map(d=>new Date ('1970-01-01T' +'00:'+ d.Time + 'Z'));
         yValues.push(new Date ('1970-01-01T' +'00:36:30' + 'Z'));
         yValues.push(new Date ('1970-01-01T' +'00:40:00' + 'Z'));

         var tooltip = d3.select("#chart").append("div")
         .attr("id", "tooltip")
         .style("opacity", 0);

         var overlay = d3.select('#chart').append('div')
         .attr('class', 'overlay')
         .style('opacity', 0);

         const xScale = d3.scaleTime()
                           .domain([d3.min(xValues), d3.max(xValues)])
                           .range([padding, w - padding]);

         const yScale = d3.scaleTime()
                           .domain([d3.min(yValues), d3.max(yValues)])
                           .range([h - padding , padding]);

         var timeFormat = d3.timeFormat("%M:%S");                  
         const xAxis = d3.axisBottom()
                         .scale(xScale).tickFormat(d3.format("d"));

         const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

         const svg = d3.select("#chart")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);

         svg.selectAll("dot")
            .data(xValues)
            .enter()
            .append("circle")
            .attr("r",6)
            .attr("cx",(d, i) => xScale(d))
            .attr("cy",(d, i) => yScale(yValues[i]))
            .attr("data-yvalue",(d,i)=>yValues[i])
            .attr("data-xvalue",(d)=>d)
            .attr("class","dot")
            .style("fill",(d, i)=>{ return dataset[i].Doping===""? "#FE9677":"#984063"})
            .on('mouseover', function(d, i) {
               overlay.transition()
                 .duration(0)
                 .style('height', 'auto')
                 .style('width', 'auto')
                 .style('opacity', .9)
                 .style('left', xScale(d)+ padding + padding + 'px')
                 .style('top', padding + padding + yScale(yValues[i]) + 'px')
               tooltip.transition()
                 .duration(200)
                 .style('height', 'auto')
                 .style('width', 'auto')
                 .style('opacity', .9);
               tooltip.html(dataset[i].Name + " : "+ dataset[i].Nationality + "<br>" + "Year : " + dataset[i].Year + ", Time: "+ dataset[i].Time + '<br><br>Doping : ' + dataset[i].Doping)
                 .attr('data-year', d)
                 .style('left', xScale(d)+ padding + padding + 'px')
                 .style('top', padding + padding + yScale(yValues[i]) + 'px')
             })
             .on('mouseout', function(d) {
               tooltip.transition()
                 .duration(200)
                 .style('opacity', 0);
               overlay.transition()
                 .duration(200)
                 .style('opacity', 0);
             });

         svg.append("g")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .attr("id","x-axis")
            .attr("class","tick")
            .call(xAxis);

         svg.append("g")
            .attr("transform", "translate(" + padding +",0)")
            .attr("id","y-axis")
            .attr("class","tick")
            .call(yAxis);

         var color = d3.scaleOrdinal(d3.schemeCategory10);

         var legendContainer = svg.append("g")
         .attr("id", "legend");
      
         var legend = legendContainer.selectAll("#legend")
         .data(color.domain())
         .enter().append("g")
         .attr("class", "legend-label")
         .attr("transform", function(d, i) {
            return "translate(0," + (h/2 - i * 20) + ")";
         });
      
         legend.append("rect")
         .attr("x", w - 18)
         .attr("width", 18)
         .attr("height", 18)
         .style("fill", color);
      
         legend.append("text")
         .attr("x", w - 24)
         .attr("y", 9)
         .attr("dy", ".35em")
         .style("text-anchor", "end")
         .text(function(d) {
            if (d) return "Riders with doping allegations";
            else {
               return "No doping allegations";
            };
         });

      })
      .catch(err => {
         console.log("Can't find json data"+err)
         window.alert("Can't load data"+err)
      })
)