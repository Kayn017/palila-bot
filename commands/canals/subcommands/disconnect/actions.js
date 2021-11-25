const { disconnectFromCanal, canalConnected } = require("../../../../services/canals");
const { LocalCache } = require("../../../../services/cache");
const cache = LocalCache.get("canals"); 

function init() {

}
function shutdown() {

}
async function execute(interaction, options) {

	const chan = options?.find(o => o.name === "salon")?.value ?? interaction.channel.id;

	const canalFound = canalConnected(chan);

	if(!canalFound) 
		return interaction.reply({ content: "Ce channel n'est connecté a aucun canal", ephemeral: true });

	const channels = cache.get(canalFound);
	channels.splice(channels.indexOf(chan), 1);
	cache.set(canalFound, channels);

	disconnectFromCanal(chan, canalFound);

	const canalDb = await interaction.client.db.Canal.findOne({ where: { id: canalFound } });
	canalDb.nbChannelsConnected--;
	canalDb.save();

	return interaction.reply({ content: "Channel déconnecté", ephemeral: true });
}
async function middleware() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};
