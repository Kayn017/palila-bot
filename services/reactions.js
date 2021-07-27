const emojis = require('../resources/emojis.json')

async function reactWithNumbers(message) {
	await message.react(emojis.one);
	await message.react(emojis.two);
	await message.react(emojis.three);
	await message.react(emojis.four);
	await message.react(emojis.five);
	await message.react(emojis.six);
	await message.react(emojis.seven);
	await message.react(emojis.eight);
	await message.react(emojis.nine);
	await message.react(emojis.ten);
}

module.exports = { reactWithNumbers }