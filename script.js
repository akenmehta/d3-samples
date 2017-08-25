const apiUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
var app = {};

app.data = [];
app.tempColor;

// app.width = 700;
// app.height = 400;

app.barChart = d3.json(apiUrl, function(e,d){
  var years = [], values = [];
  var margin = { top: 0, right: 0, bottom: 30, left: 40};
  app.width = 700 - margin.left - margin.right;
  app.height = 400 - margin.top - margin.bottom;

  if(e) { console.warn(e);}
  d.data.forEach((data) => {
    app.data.push(data[1]);
  });


  app.yScale = d3.scaleLinear()
                 .domain([0, d3.max(app.data)])
                 .range([0, app.height]);

  app.yAxisValues = d3.scaleLinear()
                      .domain([0, d3.max(app.data)])
                      .range([app.height, 0]);

  app.yAxisTicks = d3.axisRight(app.yAxisValues)
                     .ticks(10);

  app.XAxisValues = d3.scaleLinear()
                    .domain([0, d3.max(app.data)])
                    .range([app.width, 0]);

  app.XAxisTicks = d3.axisBottom(app.XAxisValues)
                     .ticks(10);

  app.xScale = d3.scaleBand()
                 .domain(app.data)
                 .padding(0.1)
                 .range([0, app.width]);

  app.color = d3.scaleLinear()
                .domain([0, d3.max(app.data)])
                .range(['#ffb832', '#c61c6f']);

  app.tooltip = d3.select('body')
                  .append('div')
                  .style('position', 'absolute')
                  .style('padding', '0 10px')
                  .style('background', 'white')
                  .style('opacity', 0);


  app.canvas = d3.select('#content').append('svg')
                 .attr('width', app.width + margin.left + margin.right)
                 .attr('height', app.height + margin.top + margin.bottom)
                 .append('g')
                 .attr('tranform', `translate( ${margin.left}, ${margin.right})`)
                 .selectAll('rect')
                 .data(app.data)
                 .enter();

  app.rect = app.canvas.append('rect')
               .attr('height', 0)
               .attr('width', (d) => app.xScale.bandwidth())
               .attr('x', (d) => app.xScale(d))
               .attr('y', app.height)
               .attr('fill', (d) => app.color(d))

               .on('mouseover', function(d){
                  app.tempColor = this.style.fill;

                  app.tooltip.transition().duration(200)
                             .style('opacity', 0.9);
                  app.tooltip.html( 
                                  `<div>$ ${d} Billion</div>`
                              )
                             .style('left', (d3.event.pageX - 35) + 'px')
                             .style('top', (d3.event.pageY - 30) + 'px');

                  d3.select(this)
                      .transition()
                      .style('fill', 'green')
               })

                .on('mouseout', function(d) {
                  app.tooltip.html('');
                  d3.select(this)
                      .transition()
                      .style('fill', app.tempColor)
               });

  app.rect.transition()
    .attr('height', (d) => app.yScale(d))
    .attr('y', (d) => app.height - app.yScale(d))
    .delay((d, i) => i*5)
    .duration(200)
    .ease(d3.easeBounceOut);

  app.yGuide = d3.select('#content svg').append('g')
                  .attr('transform', 'translate(660, 0)')
                  .call(app.yAxisTicks);

    app.XGuide = d3.select('#content svg').append('g')
                  .attr('transform', 'translate(0, 0)')
                  .call(app.XAxisTicks);               

});

