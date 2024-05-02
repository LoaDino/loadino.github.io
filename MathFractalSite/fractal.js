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
    let length = Math.min(window.innerHeight, window.innerWidth)/2

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
	let head = document.getElementsByTagName("head")
	let style = document.createElement("link")
	style.rel = 'stylesheet'

	if (window.innerHeight > window.innerWidth) {
		style.href = './style2.css'
	} else {
		style.href = './style.css'
	}

	head[0].appendChild(style)

	ON_SCROLL()

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

function visible(target) {
  // Все позиции элемента
  var targetPosition = {
      top: window.pageYOffset + target.getBoundingClientRect().top,
      left: window.pageXOffset + target.getBoundingClientRect().left,
      right: window.pageXOffset + target.getBoundingClientRect().right,
      bottom: window.pageYOffset + target.getBoundingClientRect().bottom
    },
    // Получаем позиции окна
    windowPosition = {
      top: window.pageYOffset,
      left: window.pageXOffset,
      right: window.pageXOffset + document.documentElement.clientWidth,
      bottom: window.pageYOffset + document.documentElement.clientHeight
    };

  if (targetPosition.bottom > windowPosition.top && // Если позиция нижней части элемента больше позиции верхней чайти окна, то элемент виден сверху
    targetPosition.top < windowPosition.bottom && // Если позиция верхней части элемента меньше позиции нижней чайти окна, то элемент виден снизу
    targetPosition.right > windowPosition.left && // Если позиция правой стороны элемента больше позиции левой части окна, то элемент виден слева
    targetPosition.left < windowPosition.right) { // Если позиция левой стороны элемента меньше позиции правой чайти окна, то элемент виден справа
    return true
  } else {
    return false
  };
};

function ON_SCROLL() {
	let images = document.getElementsByTagName("img")

	for (let image of images) {
		if (visible(image)) {
			image.classList.add('active')
		} else {
			image.classList.remove('active')
		}
	}

	let texts = document.getElementsByTagName('p')

	for (let text of texts) {
		if (visible(text)) {
			text.classList.add('active_alt')
		} else {
			text.classList.remove('active_alt')
		}
	}

	let heads = document.getElementsByTagName('h2')

	for (let head of heads) {
		if (visible(head)) {
			head.classList.add('active_alt')
		} else {
			head.classList.remove('active_alt')
		}
	}

	heads = document.getElementsByTagName('h3')

	for (let head of heads) {
		if (visible(head)) {
			head.classList.add('active_alt')
		} else {
			head.classList.remove('active_alt')
		}
	}

	let uls = document.getElementsByTagName('ul')

	for (let ul of uls) {
		if (visible(ul)) {
			ul.classList.add('active_alt')
		} else {
			ul.classList.remove('active_alt')
		}
	}
}

window.onscroll = ON_SCROLL