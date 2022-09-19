const { EmbedBuilder } = require("discord.js");
const { postMessageAndAwaitResponse, MESSAGE_TYPES } = require("../../../../services/worker");
const { err } = require("../../../../services/log");

function init() {

}
function shutdown() {

}
async function execute(interaction) {
	await interaction.deferReply({ ephemeral: true });

	let infos = await postMessageAndAwaitResponse(interaction.worker, { action: "now_playing" });

	if(infos.type === MESSAGE_TYPES.error) {
		err(infos.message, "actions now_playing", interaction, null);
		return interaction.editReply({ content: "Une erreur est survenue...", ephemeral: true });
	}

	if(infos.type === MESSAGE_TYPES.response && !infos.message) {
		return interaction.editReply({ content: "Aucun titre dans la liste de lecture !", ephemeral: true });
	}

	if(infos.type === MESSAGE_TYPES.response) {
		infos = infos.message;
	}

	const embed = new EmbedBuilder()
		.setTitle("Musique actuellement en lecture")
		.addField("Titre", infos.title, true)
		.addField("Auteur", infos.author, true)
		.setURL(infos.url)
		.setImage(infos.cover)
		.setColor(process.env.COLOR);

	interaction.editReply({ embeds: [embed], ephemeral: true });
}
async function middleware() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};
