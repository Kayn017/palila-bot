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

module.exports = {
	addChoiceToCommand,
	removeChoiceToCommand
};