/********** REQUIRE **********/
const Discord = require('discord.js');
const Intents = Discord.Intents;
const Permissions = Discord.Permissions;
const fs = require('fs');


/********** INFORMATIONS **********/
const name = "help";
const description = "L'aide de ce bot";
const explication = "Cette commande affiche l'aide du bot et les explications des commandes du bot";
const author = "Kayn";
const options = [{
	name: "commande",
	type: "STRING",
	description: "Nom de la commande dont vous voulez voir l'aide",
	required: false,
	choices: []
}];


/********** PERMISSIONS **********/
const intents = [];
const permissions = [];


/********** VALUE **********/
let color;


/********** ACTIONS **********/
async function execute(interaction, options) {

	const embed = new Discord.MessageEmbed();
	embed.setColor(color);

	if (options.length === 0) {
		embed.setTitle("L'aide du Palila Bot !");

		for (const [_, cmd] of interaction.client.commands.entries()) {
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
			let subCommands = ``;

			cmd.subcommands.forEach(subcmd => {

				subCommands += `** ${subcmd.name} ** : ${subcmd.description}\n`;

			});

			embed.addField("Options", subCommands);
		}
	}


	interaction.reply({ embeds: [embed] });
}

function init(client) {

	const allCommands = client.commands.keys();

	for (const cmdName of allCommands) {
		options[0].choices.push({
			name: cmdName,
			value: cmdName
		});
	}

	color = JSON.parse(fs.readFileSync("./config/config.json")).color;
}

function shutdown(client) { }


/********** EXPORTS **********/
module.exports = { name, description, explication, author, options, intents, permissions, execute, init, shutdown }