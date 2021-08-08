const emojis = require('../resources/emojis.json')

/** retourne un entier aleatoire compris entre 0 et max
 * 
 * @param {number} max 
 * @returns {number}
 */
function getRandomInt(max) {
	if (!max)
		throw new Exception("getRandomInt prend un paramètre");

	return Math.floor(Math.random() * Math.floor(max));
}

function numberToEmoji(number) {

	let emoji = null;

	if (typeof number === "string")
		number = parseInt(number)

	switch (number) {
		case 0:
			emoji = emojis.zero;
			break;
		case 1:
			emoji = emojis.one;
			break;
		case 2:
			emoji = emojis.two;
			break;
		case 3:
			emoji = emojis.three;
			break;
		case 4:
			emoji = emojis.four;
			break;
		case 5:
			emoji = emojis.five;
			break;
		case 6:
			emoji = emojis.six;
			break;
		case 7:
			emoji = emojis.seven;
			break;
		case 8:
			emoji = emojis.eight;
			break;
		case 9:
			emoji = emojis.nine;
			break;
		case 10:
			emoji = emojis.ten;
			break;
		default:
			throw new Error("Invalid number");
	}


	return emoji;
}

function emojiToNumber(emoji) {

	let number = null;

	if (typeof emoji !== "string")
		throw new Error("Emoji must be a string");

	switch (emoji) {
		case emojis.zero:
			number = 0;
			break;
		case emojis.one:
			number = 1;
			break;
		case emojis.two:
			number = 2;
			break;
		case emojis.three:
			number = 3;
			break;
		case emojis.four:
			number = 4;
			break;
		case emojis.five:
			number = 5;
			break;
		case emojis.six:
			number = 6;
			break;
		case emojis.seven:
			number = 7;
			break;
		case emojis.eight:
			number = 8;
			break;
		case emojis.nine:
			number = 9;
			break;
		case emojis.ten:
			number = 10;
			break;
		default:
			throw new Error("Invalid number");
	}


	return number;


}

module.exports = { getRandomInt, numberToEmoji, emojiToNumber }