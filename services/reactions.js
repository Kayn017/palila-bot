const emojis = require('../resources/emojis.json')

async function reactWithNumbers(message) {
	for (let i = 1; i <= 10; i++)
		await message.react(emojis[i]);
}

module.exports = { reactWithNumbers }