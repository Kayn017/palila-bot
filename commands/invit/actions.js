const { orBit } = require("../../services/numbers");

function init() {

}
function shutdown() {

}
async function execute(interaction) {

	const invit = `https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=${orBit(interaction.client.permissions)}&scope=bot%20applications.commands`;
	interaction.reply({ content: `Voici un lien d'invitation : \n${invit}`, ephemeral: true });
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
	configure
};
