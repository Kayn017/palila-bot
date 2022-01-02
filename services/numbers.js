const emojis = require("../assets/emojis.json");

function orBit(numbers) {

	let res = numbers[0];

	for (let i = 1; i < numbers.length; i++) {
		res = res | numbers[i];
	}
	return res;
}

function getRandomInt(max) {
	if (!max)
		throw new Error("Pas d'argument envoyé");

	return Math.floor(Math.random() * Math.floor(max));
}

function numberToEmoji(number) {
	if (typeof number === "string")
		number = parseInt(number);

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

module.exports = {
	orBit,
	getRandomInt,
	numberToEmoji,
	emojiToNumber
};