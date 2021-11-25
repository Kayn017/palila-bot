const Discord = require("discord.js");
const process = require("process");

function init(client) {
	const allCommands = client.commands.keys();

	for (const cmdName of allCommands) {
		this.options[0].choices.push({
			name: cmdName,
			value: cmdName
		});
	}

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

		const cmd = interaction.client.commands.get(commandName);

		embed.setTitle(cmd.name);
		embed.addField("Description", cmd.description);
		embed.addField("Explication", cmd.explication);
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