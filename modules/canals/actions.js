const { LocalCache } = require("../../services/cache");
const { connectToCanal } = require("../../services/canals");
const cache = LocalCache.get("canals");

async function init(client) {
	const canals = await client.db.Canal.findAll();

	canals.forEach( c => {
		if(c.nbChannelsConnected === 0) return;

		const channels = cache.get(c.id);

		channels.forEach( async channelId => {

			const channel = await client.channels.fetch(channelId);

			await connectToCanal(channel, c.id, client);

		});
	});
}
function shutdown() {

}
function configure() {

}
module.exports = {
	init,
	shutdown,
	configure
};
