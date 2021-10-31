const db = require("../../../../core/database");

function init() {

}
function shutdown() {

}
async function execute(interaction, options) {
	const id = options[0].value;

	const group = await db.Group.findOne({ where: { id } });

	if(group === null) {
		return interaction.reply({ content: "Ce groupe n'existe pas :o", ephemeral: true });
	}

	if(interaction.member.roles.cache.has(group.roleId))
		return interaction.reply({ content: "Vous avez déjà ce role !", ephemeral: true });

	await interaction.member.roles.add(group.roleId);

	interaction.reply({ content: `Le rôle ${group.name} vous a été ajouté !`, ephemeral: true });
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
