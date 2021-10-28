const config = require("../../../../../../services/config");
const { log } = require("../../../../../../services/log");

function init() {

}
function shutdown() {

}
async function execute(interaction, options) {

	const role = options[0].role;
	let roles = await config.get("command", "config", interaction.guild.id, "adminRoles");

	if (!roles)
		return interaction.reply({ content: "Aucun rôle n'a les droits, je ne peux pas le retirer...", ephemeral: true });

	roles = roles.split(",");

	if (!roles.includes(role.id))
		return interaction.reply({ content: "Ce rôle ne fait pas parti des rôles administrateurs", ephemeral: true });

	roles.splice(roles.indexOf(role.id), 1);
	config.set("command", "config", interaction.guild.id, "adminRoles", roles.join(","));

	log(`Retrait du role ${options[0].role.name} des roles administrateurs. (id: ${options[0].role.id})`, "config permissions remove", interaction);
	interaction.reply({ content: `Le rôle ${role.name} a été retiré des roles administrateurs !`, ephemeral: true });
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
