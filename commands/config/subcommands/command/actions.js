function init(client) {

	client.commands.forEach(cmd => {
		this.options.find(o => o.name === "propriete").choices.push(...getAllConfigurationParameters(cmd));
	});
}
function shutdown() {

}
async function execute(interaction, options) {

	const property = options.find(o => o.name === "propriete")?.value;
	const value = options.find(o => o.name === "valeur")?.value;

	executeConfigure(property.split("."), value, interaction, interaction.client.commands);

}
async function middleware() {

}


function getAllConfigurationParameters(command) {
	const parameters = Object.keys(command.configuration);

	if (command.subcommands) {
		command.subcommands.forEach(subcmd => {
			parameters.push(...getAllConfigurationParameters(subcmd));
		});
	}

	return parameters.map(param => { return { value: `${command.name}.${param}`, name: `${command.name}.${param}` }; });
}

function executeConfigure(properties, value, interaction, commands) {

	const cmd = properties[0];

	const command = commands.find(c => c.name === cmd);

	if (Object.keys(command.configuration).includes(properties[properties.length - 1])) {
		command.configuration[properties[properties.length - 1]](interaction, value);
	} else {
		properties.shift();
		executeConfigure(properties, value, interaction, command.subcommands);
	}
}

module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};
