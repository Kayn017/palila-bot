const { removeChoiceToCommand } = require("../../../../../../services/commands");
const { log } = require("../../../../../../services/log");

async function init(client, guild) {
	const options = [];

	const groups = await client.db.Group.findAll({ where: { guildId: guild.id } });

	groups.forEach((group) => {
		options.push({ name: group.name, value: "" + group.id });
	});

	this.options[0].choices = options;
}
function shutdown() {

}
async function execute(interaction, options) {
	await interaction.deferReply({ ephemeral: true });

	const id = options[0].value;

	const group = await interaction.client.db.Group.findOne({ where: { id } });

	if (group === null) {
		return interaction.editReply({
			content: "Ce rôle n'est pas le rôle d'un groupe ",
			ephemeral: true,
		});
	}

	const role = await interaction.guild.roles.fetch(group.roleId);
	await role.delete(`${interaction.user.tag} a supprimé ce groupe`);
	await group.destroy();

	const commands = await interaction.guild.commands.fetch();
	const command = commands.find((c) => c.name === "group");

	const addCommand = command.options.find((o) => o.name === "add");
	removeChoiceToCommand(addCommand, group.id);

	const removeCommand = command.options.find((o) => o.name === "remove");
	removeChoiceToCommand(removeCommand, group.id);

	const dbRemoveCommand = command.options
		.find((o) => o.name === "db")
		.options.find((o) => o.name === "remove");
	removeChoiceToCommand(dbRemoveCommand, group.id);

	await command.edit({ options: command.options });

	log(`Suppression du groupe ${group.name} par ${interaction.user.tag}`, "group db remove", interaction);

	interaction.editReply({ content: "Groupe supprimé !", ephemeral: true });
}
async function middleware() {

}

module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};
