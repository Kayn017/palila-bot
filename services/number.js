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
	if (typeof number === "string")
		number = parseInt(number)

	let str_number = String(number);
	if (number in emojis) {
		return emojis[str_number];
	} else {
		throw new Error("Invalid number");
	}
}

function emojiToNumber(emoji) {
	if (typeof emoji !== "string")
		throw new Error("Emoji must be a string");

	let k = Object.keys(emojis).find(key => emojis[key] === emoji);
	let number = parseInt(k);
	if (number < 0 || number > 10)
		throw new Error("Invalid number");
	return number;
}

module.exports = { getRandomInt, numberToEmoji, emojiToNumber }