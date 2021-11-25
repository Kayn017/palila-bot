async function init() {

}
function shutdown() {

}
async function execute() {

}
async function middleware(interaction) {
	if (!interaction.channel || interaction.channel.type === "dm") {
		interaction.reply({
			content: "Cette commande ne peut pas être utilisé en MP.",
			ephemeral: true,
		});
		return true;
	}
}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};
