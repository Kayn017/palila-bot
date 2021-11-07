const { log } = require("../../services/log");
const { initCommand, initOptions } = require("./commandManager");

async function initGuildCommands(client) {

	const guilds = await client.guilds.fetch();

	// on initialise les commandes
	// on ajoute les nouvelles commandes et on actualise les commandes déjà existantes
	client.commands.forEach(async cmd => {

		if(cmd.globalCommand) return;

		await initCommand(cmd, client);

		guilds.forEach( g => initGuildCommand(client, cmd, g));	
	});

	// on supprime les vieilles commandes qui n'existent plus en local
	guilds.forEach(async g => {

		const guild = await g.fetch();
	
		const guildCommands = await guild.commands.fetch();
		const oldCommands = guildCommands.filter(c => !client.commands.has(c.name));
	
		oldCommands.forEach(c => {
			c.delete();
			log(`Suppression de la commande ${c.name} de la guild ${g.name}. Celle-ci n'est plus présente en local.`, "guildCommandManager");
		});
	});
}

async function initGuildCommand(client, cmd, g) {
	const guild = await g.fetch();

	const guildCommands = await guild.commands.fetch();
	const distantCommand = guildCommands.find(c => c.name === cmd.name);

	const data = {
		name: cmd.name,
		description: cmd.description,
		options: initOptions(cmd)
	};

	if (distantCommand)
		client.application.commands.edit(distantCommand, data, guild.id);
	else
		client.application.commands.create(data, guild.id);
}

module.exports = {
	initGuildCommands,
	initGuildCommand
};