const { EmbedBuilder } = require("discord.js");
const process = require("process");

function init() {

}
function shutdown() {

}
async function execute(interaction) {

	const canals = await interaction.client.db.Canal.findAll();

	let desc = "";

	for(const canal of canals) {
		desc += ` - ${canal.name} : ${canal.nbChannelsConnected} salon(s) connecté(s)\n`;
	}

	if(canals.length < 1)
		desc = "Aucun canal créé !";

	const embed = new EmbedBuilder()
		.setColor(process.env.COLOR)
		.setTitle("Liste des canaux")
		.setDescription(desc);

	return interaction.reply({ embeds: [embed] });

}
async function middleware() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};
