const { err } = require("../../services/log");


function executeCommand(commandCollection, commandName, options, interaction) {

	options = [...options];

	if (!commandCollection.has(commandName))
		return err(`Tentative d'execution d'une commande qui n'existe pas : ${commandName}`, "commandExecutor");

	const cmd = commandCollection.get(commandName);

	if (!cmd.subcommands)
		cmd.execute(interaction, options);
	else {
		const subCommandName = options[0].name;
		options = options[0].options;
		executeCommand(cmd.subcommands, subCommandName, options, interaction);
	}
}

module.exports = {
	executeCommand
}