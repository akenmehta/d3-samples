var flowers = [
  {
    "name": "Hydrangia",
    "latin": "Hydrangea",
    "light": "Sun",
    "ease": 3
  },
  {
    "name": "Chrysanthemum",
    "latin": "Chrysanthemum",
    "light": "Part Sun",
    "ease": 1
  },
  {
    "name": "Peony",
    "latin": "Paeonia",
    "light": "Part Sun",
    "ease": -1
  },
  {
    "name": "Orchid",
    "latin": "Paeonia",
    "light": "Shade",
    "ease": -5
  },
  {
    "name": "Fern",
    "latin": "Dryopteris",
    "light": "Shade",
    "ease": 5
  }
];


var width = window.innerWidth, 
    height = window.innerHeight,
    padding = Math.floor(width * 0.01);
    

var svg = d3.select('#content').append('svg')
          .attr('viewbox', '0 0 ' + width + ' ' + height)
          .attr('width', width)
          .attr('height', height);

function update(new_data) {

  flowers.map((flower) => {
    flower['value'] = Math.floor(Math.random() * 100) + 1 ;
    return flower;
  });

  var flower_domain = d3.extent(new_data, (d) => d.value);

  var bar_height = d3.scale.linear()
                      .domain(flower_domain)
                      .range([0, height]);

  var bar_width = width/new_data.length;

  var rects = svg.selectAll('rect').data(new_data)

  rects.enter().append('rect')


  rects.attr({
    'x': (d, i) => i * bar_width,
    'y': (d, i) =>  height - bar_height(d.value),
    'width': bar_width - padding,
    'height': (d) => bar_height(d.value),
    'fill': 'darkcyan'
  })

}

update(flowers);


