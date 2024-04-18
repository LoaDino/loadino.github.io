const maxDepth = 11 // Increase to generate more iterations (beware of performance impact)
const maxIterations = 8

var iteration = 0
var depth = 1

var canvas = null
var ctx = null

var intervalID = 0

var order = 10;
var angle = Math.PI / 2;

function drawLevyCurve(x, y, length, angle, depth) {
	if (depth == 0) {
		const color = getRandomColor()
		ctx.beginPath()
		ctx.moveTo(x, y)
		const endX = x + length * Math.cos(angle)
		const endY = y + length * Math.sin(angle)
		ctx.strokeStyle = color
		ctx.lineTo(endX, endY)
		ctx.stroke()
	} else {
		length /= Math.sqrt(2)
		drawLevyCurve(x, y, length, angle + Math.PI / 4, depth - 1)
		x += length * Math.cos(angle)
		y += length * Math.sin(angle)
		drawLevyCurve(x, y, length, angle - Math.PI / 4, depth - 1)
	}
}


function animateLevyCurve() {
    var length = Math.min(window.innerHeight, window.innerWidth)/2

	ctx.clearRect(0, 0, canvas.width, canvas.height)
	drawLevyCurve(canvas.width/2,canvas.height/4, length, Math.PI / 2, depth)
	depth++
	if (depth > maxDepth) {
		window.clearInterval(intervalID)
	}
}

function drawTriangle(x, y, size) {
	ctx.beginPath()
	ctx.moveTo(x, y)
	ctx.lineTo(x + size, y)
	ctx.lineTo(x + size / 2, y + (size * Math.sqrt(3)) / 2)
	ctx.closePath()
	ctx.stroke()
	ctx.fill()
}

function animateSierpinski() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	drawSierpinski(0, 0, canvas.width, iteration)
	iteration = (iteration + 1)
    if (iteration > maxIterations) {
        clearInterval(intervalID)
    } else {
        ctx.strokeStyle = getRandomColor()
		ctx.fillStyle = getRandomColor()
    }
}

function drawSierpinski(x, y, size, iterations) {
	if (iterations === 0) {
		drawTriangle(x, y, size)
	} else {
		const newSize = size / 2
		drawSierpinski(x, y, newSize, iterations - 1)
		drawSierpinski(
			x + newSize / 2,
			y + (newSize * Math.sqrt(3)) / 2,
			newSize,
			iterations - 1
		)
		drawSierpinski(x + newSize, y, newSize, iterations - 1)
	}
}

function getRandomColor() {
	const letters = '0123456789ABCDEF'
	let color = '#'
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}



function start() {
	canvas = document.getElementById('Canvas')
	ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
	canvas.height = window.innerHeight

    rand = Math.random() * 2

    if (rand > 1.0) {
	    intervalID = setInterval(animateLevyCurve, 150)
    } else {
        intervalID = setInterval(animateSierpinski, 150)
    }
}

window.onload = start
