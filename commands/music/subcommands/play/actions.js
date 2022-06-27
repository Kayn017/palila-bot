const { MessageEmbed } = require("discord.js");
const { postMessageAndAwaitResponse, MESSAGE_TYPES } = require("../../../../services/worker");

function init() {

}
function shutdown() {

}
async function execute(interaction, options) {

	await interaction.deferReply({ ephemeral: true });

	let infos = await postMessageAndAwaitResponse(interaction.worker, { action: "play", url: options[0].value });

	if(infos.type === MESSAGE_TYPES.error) {
		return interaction.editReply({ content: infos.message, ephemeral: true });
	}

	if(infos.type === MESSAGE_TYPES.response) {
		infos = infos.message;
	}

	const embed = new MessageEmbed()
		.setTitle("Musique mise en file d'attente")
		.addField("Titre", infos.title, true)
		.addField("Auteur", infos.author, true)
		.addField("Position dans la file d'attente", `${infos.position + 1}`)
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
