const { err } = require("../../services/log");

function handleCommand(client) {

	client.on("interactionCreate", interaction => {
		if (!interaction.isCommand()) return;

		executeCommand(client.commands, interaction.commandName, interaction.options.data, interaction);
	});
}

async function executeCommand(commandCollection, commandName, options, interaction) {

	if (!commandCollection.has(commandName))
		return err(`Tentative d'execution d'une commande qui n'existe pas : ${commandName}`, "commandHandler");

	const cmd = commandCollection.get(commandName);

	if (!cmd.subcommands) {
		try {
			await cmd.execute(interaction, options);
		}
		catch (e) {

			if (e.message.startsWith("Missing Permissions"))
				return interaction.reply({ content: "Je manque de permissions pour faire cette action...", ephemeral: true });
			else {
				err(e, "commandHandler", undefined, e.stack);
				if(interaction.replied) 
					return interaction.editReply({ content: "Une erreur a eu lieu lors de l'execution de la commande...", ephemeral: true });
				
				return interaction.reply({ content: "Une erreur a eu lieu lors de l'execution de la commande...", ephemeral: true });
			}
		}
	}
	else {
		const subcmd_name = options[0].name;
		const subcmd_options = options[0].options;

		let stopExecution = false;
		try {
			stopExecution = await cmd.middleware(interaction, options);
		}
		catch (e) {
			err(e, "commandHandler", undefined, e.stack);
		}
		if (stopExecution) return;

		executeCommand(cmd.subcommands, subcmd_name, subcmd_options, interaction);
	}
}

module.exports = {
	handleCommand,
	executeCommand
};