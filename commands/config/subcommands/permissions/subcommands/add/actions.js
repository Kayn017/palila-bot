const config = require("../../../../../../services/config");
const { log } = require("../../../../../../services/log");

function init() {

}
function shutdown() {

}
async function execute(interaction, options) {

	const role = options[0].role;

	let roles = await config.get("command", "config", interaction.guild.id, "adminRoles");

	if (!roles) {
		roles = [];
	}
	else {
		roles = roles.split(",");
	}

	if (roles.includes(role.id))
		return interaction.reply({ content: `Le rôle ${role.name} a déjà les permissions !`, ephemeral: true });

	roles.push(role.id);
	config.set("command", "config", interaction.guild.id, "adminRoles", roles.join(","));

	log(`Ajout du role ${options[0].role.name} parmi les roles administrateurs. (id: ${options[0].role.id})`, "config permissions add", interaction);
	interaction.reply({ content: `Le rôle ${role.name} a été ajouté aux roles administrateurs !`, ephemeral: true });
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
