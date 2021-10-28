const { isGod } = require("../../services/permissions");
const config = require("../../services/config");
const { Permissions } = require("discord.js");

function init() {

}
function shutdown() {

}
async function execute() {

}
async function middleware(interaction) {

	if (interaction.channel.type === "dm") {
		interaction.reply({ content: "Cette commande ne peut pas être utilisé en MP.", ephemeral: true });
		return true;
	}

	const god = await isGod(interaction.user.id);
	const admin = (await config.get("command", "config", interaction.guild.id, "adminRoles"))?.includes(interaction.user.id);

	if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR, true) && !god && !admin) {
		interaction.reply({ content: "Vous n'avez pas les droits pour executer cette commande.", ephemeral: true });
		return true;
	}
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
