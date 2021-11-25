const Discord = require("discord.js");
const process = require("process");
const { getAllCommandsName, getLocalCommandByString } = require("../../services/commands");

function init(client) {
	
	const commandsName = client.commands.map( cmd => getAllCommandsName(cmd) );

	commandsName.flat().forEach( name => {
		this.options[0].choices.push({
			name: name,
			value: name
		});
	});

	this.color = process.env.COLOR;
}

function shutdown() {

}
async function execute(interaction, options) {
	const embed = new Discord.MessageEmbed();
	embed.setColor(this.color);

	if (options.length === 0) {
		embed.setTitle("L'aide du Palila Bot !");

		for (const cmd of interaction.client.commands.values()) {
			embed.addField(cmd.name, cmd.description);
		}
	}
	else {
		const commandName = options[0].value;

		const cmd = getLocalCommandByString(commandName, interaction.client.commands);

		embed.setTitle(commandName);
		embed.addField("Description", cmd.description);
		embed.addField("Explication", cmd.explication);

		if(Object.keys(cmd.configuration).length > 0) {
			let parameters = "";

			Object.keys(cmd.configuration).forEach( k => parameters = parameters.concat(`- ${k}\n`));

			embed.addField("Paramètres à configurer", parameters);
		}

		embed.setFooter(`Commande créée par ${cmd.author}`);

		if (cmd.subcommands) {
			let subCommands = "";

			cmd.subcommands.forEach(subcmd => {
				subCommands += `**${subcmd.name}** : ${subcmd.description}\n`;
			});

			embed.addField("Options", subCommands);
		}
	}

	interaction.reply({ embeds: [embed] });
}
async function middleware() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};