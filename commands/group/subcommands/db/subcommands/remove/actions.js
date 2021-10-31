const db = require("../../../../../../core/database");
const { log } = require("../../../../../../services/log");

function init() {

}
function shutdown() {

}
async function execute(interaction, options) {

	await interaction.deferReply({ ephemeral: true });

	const id = options[0].value;

	const group = await db.Group.findOne({ where: { id }});

	if(group === null) {
		return interaction.editReply({ content: "Ce rôle n'est pas le rôle d'un groupe ", ephemeral: true });
	}

	const role = await interaction.guild.roles.fetch(group.roleId);
	await role.delete(`${interaction.user.tag} a supprimé ce groupe`);
	await group.destroy();

	const commands = await interaction.guild.commands.fetch();
	const command = commands.find(c => c.name === "group");

	const addCommand = command.options.find(o => o.name === "add");
	if(addCommand.options[0].choices === undefined) addCommand.options[0].choices = [];
	addCommand.options[0].choices = addCommand.options[0].choices.filter(c => c.value != group.id);

	const removeCommand = command.options.find(o => o.name === "remove");
	if(removeCommand.options[0].choices === undefined) removeCommand.options[0].choices = [];
	removeCommand.options[0].choices = removeCommand.options[0].choices.filter(c => c.value != group.id);

	const dbRemoveCommand = command.options.find(o => o.name === "db").options.find(o => o.name === "remove");
	if(dbRemoveCommand.options[0].choices === undefined) dbRemoveCommand.options[0].choices = [];
	dbRemoveCommand.options[0].choices = dbRemoveCommand.options[0].choices.filter(c => c.value != group.id);

	await command.edit({ options: command.options });


	log(`Suppression du groupe ${group.name} par ${interaction.user.tag}`, "group db remove", interaction);

	interaction.editReply({ content: "Groupe supprimé !", ephemeral: true });
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
