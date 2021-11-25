const { isGod } = require("../../../../services/permissions");
const { LocalCache } = require("../../../../services/cache");
const { log } = require("../../../../services/log");
const { Guild } = require("discord.js");
const { removeChoiceToCommand } = require("../../../../services/commands");
const cache = LocalCache.get("canals");

async function init(client) {
	const options = [];

	const canals = await client.db.Canal.findAll();

	canals.forEach( canal => {
		options.push({ name: canal.name, value: "" + canal.id });
	});

	this.options[0].choices = options;
}
function shutdown() {

}
async function execute(interaction, options) {

	if(!(await isGod(interaction.user.id)))	return interaction.reply({ content: "Vous n'avez pas les droits pour effectuer cette commande", ephemeral: true });

	await interaction.deferReply({ ephemeral: true });


	const canalId = options[0].value;

	const canal = await interaction.client.db.Canal.findOne({ where: { id: canalId }});

	if(canal === null) return interaction.reply({ content: "Ce canal n'existe pas...", ephemeral: true });

	if(cache.has(canalId))
		cache.delete(canalId);

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
		removeChoiceToCommand(connectCommand, canal.id);
		const deleteCommand = command.options.find((o) => o.name === "delete");
		removeChoiceToCommand(deleteCommand, canal.id);
	
		await command.edit({ options: command.options });
	}

	log(`Suppression du canal ${canal.name} par ${interaction.user.tag}`, "canals delete", interaction);
	canal.destroy();
	interaction.editReply({ content: "Canal supprimé !", ephemeral: true });
}
async function middleware() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};
