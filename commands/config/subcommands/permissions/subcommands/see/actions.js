const config = require("../../../../../../services/config");
const process = require("process");
const Discord = require("discord.js");

function init() {

}
function shutdown() {

}
async function execute(interaction) {
	let roles = await config.get("command", "config", interaction.guild.id, "adminRoles");

	if (!roles)
		return interaction.reply({ content: "Aucun autre rôle n'a les droits pour modifier le bot. Seuls les administrateurs et les gods peuvent configurer le bot." });

	const embed = new Discord.MessageEmbed()
		.setColor(process.env.COLOR)
		.setTitle("Liste des roles admin de ce serveur");

	let text = "";

	for (const roleId of roles.split(",")) {
		const role = await interaction.guild.roles.fetch(roleId);
		text = text + `\n- ${role.name}`;
	}

	embed.setDescription(text);
	interaction.reply({ embeds: [embed] });

}
async function middleware() {

}
async function configure() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
	configure,
};
