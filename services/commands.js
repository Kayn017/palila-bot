const path = require("path");
const { fetchCommands } = require("../core/commands/commandManager");

function addChoiceToCommand(command, name, id, optionIndex = 0) {

	if (command.options[optionIndex].choices === undefined)
		command.options[optionIndex].choices = [];
	command.options[optionIndex].choices.push({
		name: name,
		value: "" + id,
	});	
}

function removeChoiceToCommand(command, id, optionIndex = 0) {
	if (command.options[optionIndex].choices === undefined)
		command.options[optionIndex].choices = [];
	command.options[optionIndex].choices = command.options[optionIndex].choices.filter(
		(c) => c.value != id
	);
}

function getAllCommandsName(cmd) {

	if(!cmd.subcommands) 
		return [ cmd.name ];

	const subCmdNames = cmd.subcommands.map(c => getAllCommandsName(c) ).flat(); 

	return subCmdNames.map( name => `${cmd.name} ${name}` );
}

function getLocalCommandByString(name, commands) {

	const cmdName = name.split(" ")[0];

	const cmd = commands.find( c => c.name === cmdName );

	if( !cmd || !cmd.subcommands || name.split(" ").length === 1 )
		return cmd;
	else
		return getLocalCommandByString( name.split(" ").slice(1).join(" "), cmd.subcommands );
		
}

module.exports = {
	addChoiceToCommand,
	removeChoiceToCommand,
	getAllCommandsName,
	getLocalCommandByString
};