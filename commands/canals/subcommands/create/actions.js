const { log } = require("../../../../services/log");
const process = require("process");
const { Guild } = require("discord.js");
const { addChoiceToCommand } = require("../../../../services/commands");

function init() {

}
function shutdown() {

}
async function execute(interaction, options) {

	interaction.deferReply({ ephemeral: true });

	const canalName = options.find(o => o.name === "nom").value;

	if(await interaction.client.db.Canal.findOne({ where: { name: canalName } }))
		return interaction.reply({ content: "Ce canal existe déjà !", ephemeral: true });

	const canal = await interaction.client.db.Canal.create({
		name: canalName,
		nbChannelsConnected: 0
	});


	// on met a jour les commandes en ajouter le canal parmi les choix des autres subcommands 
	let guilds = await interaction.client.guilds.fetch(global.devEnv ? process.env.DEVGUILD : null);

	if(guilds instanceof Guild) 
		guilds = [guilds];
	else
		guilds = [...guilds.values()];

	for(let guild of guilds) {

		guild = await guild.fetch();

		const commands = await guild.commands.fetch();
		const command = commands.find((c) => c.name === "canals");

		const connectCommand = command.options.find((o) => o.name === "connect");
		addChoiceToCommand(connectCommand, canal.name, canal.id);
		const deleteCommand = command.options.find((o) => o.name === "delete");
		addChoiceToCommand(deleteCommand, canal.name, canal.id);
	
		await command.edit({ options: command.options });
	}

	log(`Création du canal ${canalName} par ${interaction.user.tag}`, "canals create", interaction);

	return interaction.editReply({ content: "Canal créé !", ephemeral: true });
}
async function middleware() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};
