const db = require("../../../../core/database");

async function init(client, guild) {

	const options = [];

	const groups = await db.Group.findAll({ where: { guildId: guild.id } });

	groups.forEach( group => {
		options.push({ name: group.name, value: "" + group.id })
	});

	this.options[0].choices = options;
}
function shutdown() {

}
async function execute(interaction, options) {

	const id = options[0].value;

	const group = await db.Group.findOne({ where: { id } });

	if(group === null) {
		return interaction.reply({ content: "Ce groupe n'existe pas :o", ephemeral: true });
	}

	if(!interaction.member.roles.cache.has(group.roleId))
		return interaction.reply({ content: "Vous n'avez pas ce role", ephemeral: true });

	await interaction.member.roles.remove(group.roleId);

	interaction.reply({ content: `Le rôle ${group.name} vous a été enlevé !`, ephemeral: true });
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
