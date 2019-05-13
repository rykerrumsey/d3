/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

const chartHeight = 400;
const chartWidth = 600;

const margin = {top: 10, right: 10, bottom: 100, left: 100};

const height = chartHeight - margin.left - margin.right;
const width = chartWidth - margin.top - margin.bottom;

let svg = d3.select("#chart-area").append("svg")
	.attr("width", chartWidth)
	.attr("height", chartHeight);

let g = svg.append("g")
				.attr("transform", `translate(${margin.left}, ${margin.top})`);

let xLabel = g.append("text")
		.attr("class", "x-axis-label")
		.attr("x", width / 2)
		.attr("y", height + 50)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.text("Month");

let yLabel = g.append("text")
		.attr("class", "y-axis-label")
		.attr("x", -(height / 2))
		.attr("y", -60)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.text("Revenue");

d3.json("data/revenues.json").then((data) => {

		data.forEach((d) => {
				d.revenue = +d.revenue;
				d.profit = +d.profit;
		});

		console.log(data);

		// set up the scale for the X axis
		const xDomain = data.map(item => item.month);
		const x = d3.scaleBand()
				.domain(xDomain)
				.range([0, width])
				.paddingInner(0.2)
				.paddingOuter(0.2);

		// set up the scale for the Y axis
		const y = d3.scaleLinear()
				.domain([0, d3.max(data, (d) => d.revenue)])
				.range([height, 0]);

		// set up X axis 
		let xAxisCall = d3.axisBottom(x);
		g.append("g")
				.attr("class", "x-axis")
				.attr("transform", `translate(0, ${height})`)
				.call(xAxisCall);

		// set up Y axis
		let yAxisCall = d3.axisLeft(y);
		g.append("g")
				.attr("class", "y-axis")
				.call(yAxisCall);

		// append all the data as rect
		const rectangles = g.selectAll("rect").data(data).enter().append("rect")
				.attr("width", x.bandwidth())
				.attr("height", (d) => {
						return height - y(d.revenue);
				})
				.attr("y", (d) => y(d.revenue))
				.attr("x", (d) => {
						return x(d.month);
				})
				.attr("fill", "blue");


		
});
