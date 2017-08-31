const api_key2010 = 'http://atlas.media.mit.edu/hs92/export/2015/show/all/all/';

d3.json(api_key2010, function(d) {
  var export_values = [],
      yScale;
  var width = 700,
      height = 300;

  d.data.forEach((d) => {
    export_values.push(d.export_val);
  })
  console.log(export_values);

  yScale = d3.scaleLinear()
              .domain([0, d3.max(export_values)])
              .range([0, height]);

  var canvas = d3.select('#content').append('svg')
                  .attr('width', width)
                  .attr('height', height);
  var rect = canvas.selectAll('rect')
               .data(export_values)
               .enter()
                .append('rect')
                .attr('width', 10)
                .attr('height', (d) => yScale(d) * 5)
                .attr('y', (d) => height - yScale(d)*5)
                .attr('x', (d, i) => i*12);
});