const api_key2010 = 'http://atlas.media.mit.edu/hs92/export/2010/show/all/all/';
const api_key2011 = 'http://atlas.media.mit.edu/hs92/export/2011/show/all/all/';
const api_key_attr = 'http://atlas.media.mit.edu/attr/country/';

var data = {};
var country_attrs ={};

var width = window.innerWidth;
var height = window.innerHeight;

// https://bl.ocks.org/mbostock/6738109
var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹",
    formatPower = function(d) { 
    			return (d + "").split("").map(function(c) { 
    				return superscript[c]; 
    					}).join(""); };

var x_scale = d3.scaleLog().range([0, width]);
var y_scale = d3.scaleLog().range([height, 0]);

var x_axis = d3.axisBottom()
				.scale(x_scale)
				.ticks( 10, (d) => 10 + formatPower(Math.round( Math.log(d) / Math.LN10)) )
				.orient('top');

var y_axis = d3.axisLeft()
				.scale(y_scale)
				.ticks( 10, (d) => 10 + formatPower(Math.round( Math.log(d) / Math.LN10)) )
				.orient('right');

var svg = d3.select('#content').append('svg')
			.attr('viewbox', `0 0 ${width} ${height}`)
			.attr('width', width)
			.attr('height', height);

d3.json(api_key_attr, (error, countries) => {

	if(error) { return console.log(error)};

	countries.data.forEach( (d) => {
		country_attrs[d.id] = d;
	});
});

d3.json(api_key2010, function(error_2010, json_2010) {

	if(error_2010) { return console.warn('error_2010');}
	
	json_2010.data.forEach( (d) => {
		data[d.origin_id] = {
			export_val_2010: d.export_val,
			id: d.origin_id
		};
	});

	d3.json(api_key2011, function(error_2011, json_2011) {

		if(error_2011) { return console.warn('error_2011');}

		json_2011.data.forEach( (d) => {
			if(data[d.origin_id]) {
				data[d.origin_id]['export_val_2011'] =  d.export_val;
			}
		});
		visualizeit();
	});
});

function visualizeit() {
	x_scale.domain(d3.extent(d3.values(data), (d) => d.export_val_2010));
	y_scale.domain(d3.extent(d3.values(data), (d) => d.export_val_2011));

	svg.append('g')
		.attr('transform', 'translate(0,' + (height - 1) + ')')
		.attr('class', 'axis')
		.call(x_axis);

	svg.append('g')
		.attr('class', 'axis')
		.call(y_axis);

	var country_g = svg.selectAll('g.country')
						.data(d3.values(data))
						.enter()
						.append('g')
						.attr('class', 'country');

	country_g.append('text')
		.attr('x', (d) => x_scale(d.export_val_2010))
		.attr('y', (d) => {	 
			if(d.export_val_2011) {
				return y_scale(d.export_val_2011);
			}
			return y_scale.range()[0]; 		
		})
		.attr('r', 5)
		.attr('fill', (d) => country_attrs[d.id].color )
		.text( (d) => {
			if (country_attrs[d.id]['display_id']) {
				return country_attrs[d.id]['display_id'].toUpperCase();
			}
		});

	svg.selectAll('circle')
		.data(d3.values(data))
		.enter()
		.append('circle')
		.attr('cx', (d) => x_scale(d.export_val_2010))
		.attr('cy', (d) => {	 
			if(d.export_val_2011) {
				return y_scale(d.export_val_2011);
			}
			return y_scale.range()[0]; 		
		})
		.attr('r', 5)
		.attr('fill', (d) => country_attrs[d.id].color );
}


