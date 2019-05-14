/*
*    main.js
*    Project 2 - Gapminder Clone
*/

// set up width and height
const canvasWidth = 800;
const canvasHeight = 500;

// set up margins
const margin = { top: 50, bottom: 100, left: 80, right: 20 };

const svgWidth = canvasWidth - margin.left - margin.right;
const svgHeight = canvasHeight - margin.top - margin.bottom;

// select the canvas
const svg = d3.select("#chart-area")
	.append("svg")
		.attr("width", canvasWidth)
		.attr("height", canvasHeight)
	.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);

// set up time
let time = 0;

// set up axis scales
const xScale = d3.scaleLog()
	.domain([300, 150000])
	.range([0, svgWidth])

const yScale = d3.scaleLinear()
	.domain([0, 90])
	.range([svgHeight, 0])

const areaScale = d3.scaleLinear()
	.domain([2000, 1400000000])
	.range([25*Math.PI, 1500*Math.PI])

const colorScale = d3.scaleOrdinal(d3.schemePastel1)

// set up X axis
const xAxis = d3.axisBottom(xScale)
	.tickValues([400, 4000, 40000])
	.tickFormat(d3.format("$"))

// attach X axis to svg
svg.append("g")
	.attr("class", "x axis")
	.attr("transform", `translate(0,${svgHeight})`)
	.call(xAxis)

// set up Y axis
const yAxis = d3.axisLeft(yScale)
	.tickFormat((d) => +d)

// attach Y axis to svg
svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)

// set up labels
const labelX = svg.append("text")
	.attr("y", svgHeight + 50)
	.attr("x", svgWidth / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("GDP Per Capita ($)")

const labelY = svg.append("text")
	.attr("y", -40)
	.attr("x", -170)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("Life Expectancy (Years)")

const labelTime = svg.append("text")
	.attr("x", svgWidth - 40)
	.attr("y", svgHeight - 40)
	.attr("opacity", "0.4")
	.attr("font-size", "40px")
	.attr("text-anchor", "middle")
	.text("1800")

// acquire and clean data
d3.json("data/data.json").then(function(data){
	
	// Clean data
	const formattedData = data.map(function(year){
		console.log(year)
		console.log(year["countries"])
		return year["countries"].filter(function(country){
			var dataExists = (country.income && country.life_exp)
			return dataExists
		}).map(function(country){
			country.income = +country.income
			country.life_exp = +country.life_exp
			return country
		})
	})

	// set up interval
	d3.interval(() => {
		time = (time < 214) ? time+1 : 0
		update(formattedData[time])
	}, 100)

	// start the visualization
	update(formattedData[0])
})

// update function
const update = (data) => {
	
	// setup transition time
	const t = d3.transition()
		.duration(100)
	
	// JOIN new data with old elements
	let circles = svg.selectAll("circle").data(data, (d) => d.country)

	// REMOVE old elements not present
	circles.exit()
		.attr("class", "exit")
		.remove()
	
	// ENTER new elements from data
	circles.enter()
		.append("circle")
		.attr("fill", (d) => colorScale(d.continent))
		.merge(circles)
		.transition(t)
			.attr("cy", (d) => yScale(d.life_exp))
			.attr("cx", (d) => xScale(d.income))
			.attr("r", (d) => Math.sqrt(areaScale(d.population) / Math.PI))

	// Update the time label
	labelTime.text(+(time + 1800))
}
