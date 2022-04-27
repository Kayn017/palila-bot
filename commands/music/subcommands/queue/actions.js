const { MessageEmbed } = require("discord.js");
const { postMessageAndAwaitResponse, MESSAGE_TYPES } = require("../../../../services/worker");

function init() {

}
function shutdown() {

}
async function execute(interaction) {
	await interaction.deferReply({ ephemeral: true });

	let infos = await postMessageAndAwaitResponse(interaction.worker, { action: "queue" });

	if(infos.type !== MESSAGE_TYPES.response) {
		return;
	}

	if(infos.message.length === 0) 
		return interaction.editReply({ content: "Aucune musique dans la liste de lecture", ephemeral: true });

	const embed = new MessageEmbed()
		.setTitle("File d'attente")
		.addField("En cours de lecture", infos.message[0].title)
		.setColor(process.env.COLOR);

	let list = "";

	for(const [ key, value ] of Object.entries(infos.message)) {
		if(key === "0") continue;

		list += `**${key}** : ${value.title}\n`;
	}

	if(list === "") {
		list = "Aucune musique après celle la";
	}

	embed.addField("En attente", list);

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
