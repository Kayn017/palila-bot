const { addChoiceToCommand } = require("../../../../../../services/commands");
const { log } = require("../../../../../../services/log");

function init() {

}
function shutdown() {

}
async function execute(interaction, options) {
	await interaction.deferReply({ ephemeral: true });

	const groupName = options[0].value;

	const exist = await interaction.client.db.Group.findOne({ where: { name: groupName } });

	if (exist !== null) {
		return interaction.editReply({
			content: "Ce groupe existe déjà ",
			ephemeral: true,
		});
	}

	const role = await interaction.guild.roles.create({
		name: groupName,
		reason: `${interaction.user.tag} a créé ce groupe`,
	});

	const group = await interaction.client.db.Group.create({
		name: groupName,
		roleId: role.id,
		guildId: interaction.guild.id,
	});

	log(`Création du groupe ${groupName} par ${interaction.user.tag}`, "group db add", interaction);

	const commands = await interaction.guild.commands.fetch();
	const command = commands.find((c) => c.name === "group");

	const addCommand = command.options.find((o) => o.name === "add");
	addChoiceToCommand(addCommand, group.name, group.id);

	const removeCommand = command.options.find((o) => o.name === "remove");
	addChoiceToCommand(removeCommand, group.name, group.id);

	const dbRemoveCommand = command.options
		.find((o) => o.name === "db")
		.options.find((o) => o.name === "remove");
	addChoiceToCommand(dbRemoveCommand, group.name, group.id);

	await command.edit({ options: command.options });

	interaction.editReply({ content: "Groupe créé !", ephemeral: true });
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
