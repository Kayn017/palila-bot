const Discord = require("discord.js");


function getAllIntents(...collections) {

	const intents = [];

	for (const collection of collections) {

		if (!(collection instanceof Discord.Collection))
			throw new Error("The given argument is not a discord collection.");

		collection.forEach(item => {

			if (item.subcommands)
				intents.push(...getCommandIntents(item));
			else
				for (const intent of item.intents) {
					if (!intents.includes(intent))
						intents.push(intent);
				}
		});
	}

	return intents;
}

function getCommandIntents(command) {

	if (!command.subcommands)
		return command.intents;

	const intents = [...command.intents];

	command.subcommands.forEach(subcmd => {
		for (const intent of getCommandIntents(subcmd)) {
			if (!intents.includes(intent)) {
				intents.push(intent);
			}
		}
	});

	return intents;
}

module.exports = {
	getAllIntents,
	getCommandIntents
};