const { log } = require("../../services/log");
const process = require("process");
const { initGuildCommand } = require("../commands/guildCommandManager");


function handleNewGuild(client) {
	client.on("guildCreate", guild => {
		log(`Arrivée du bot sur le serveur ${guild.name}`, "guildHandler");

		if(global.devEnv && guild.id !== process.env.DEVGUILD) return;

		client.commands.filter(cmd => !cmd.globalCommand).forEach(cmd => initGuildCommand(client, cmd, guild));
	});
}

module.exports = {
	handleNewGuild
};