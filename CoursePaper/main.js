function getRandomRussianWord() {
	const randomIndex = Math.floor(Math.random() * russianWords.length)
	return russianWords[randomIndex]
}

function get_answer(word) {
	for (let i = 0; i < word.length; i++) {
		if ((i + 1) % 2 !== 0 && word[i] === 'в') {
			return 'да'
		}
	}
	return 'нет'
}

function send_word() {
	let word = document.getElementById('input_text').value
	let result_output = document.getElementById('result')

	let answer = get_answer(word)

	result_output.innerHTML = `СЛОВО: ${word}<br/>РЕЗУЛЬТАТ: ${answer}`
}

function random_word() {
	let word = getRandomRussianWord()
    let result_output = document.getElementById('result')

	let answer = get_answer(word)

	result_output.innerHTML = `СЛОВО: ${word}<br/>РЕЗУЛЬТАТ: ${answer}`
}

window.onload = function () {
	document.getElementById('send').onclick = send_word
	document.getElementById('random').onclick = random_word
}
