const Discord = require("discord.js");


function getAllIntents(...collections) {

	const intents = [];

	for (const collection of collections) {

		if (!(collection instanceof Discord.Collection))
			throw new Error("The given argument is not a discord collection.");

		collection.forEach(item => {
			for (const intent of item.intents) {
				if (!intents.includes(intent))
					intents.push(intent)
			}
		})
	}

	return intents;
}

module.exports = {
	getAllIntents
}