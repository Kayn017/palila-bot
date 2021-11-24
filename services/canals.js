const WebHook = require("./webhook");
const { LocalCache } = require("./cache");
const cache = LocalCache.get("canals");

const channelsConnected = {};

async function connectToCanal(channel, canal, client) 
{
	const can = await client.db.Canal.findOne({ where: { id: canal } });

	channel.send({
		content: `Channel connecté au canal ${can.name}`
	});

	const msgCollector = channel.createMessageCollector({ filter: m => !m.author.bot, dispose: true });

	msgCollector.on("collect", msg => {
		cache.get(canal).filter( c => c !== msg.channel.id).forEach( async chanId => {
			const chan = await client.channels.fetch(chanId);
			const webhook = await WebHook.get(chan);
			webhook.send({ 
				content: msg.content.length > 0 ? msg.content : ".",
				username: msg.author.username,
				avatarURL: msg.author.avatarURL(), 
				files: [...msg.attachments.values()]
			});
		});
	});

	msgCollector.on("dispose", () => {
		channel.send({
			content: `Channel déconnecté du canal ${can.name}`
		});
	});

	msgCollector.on("end", () => {
		channel.send({
			content: `Channel déconnecté du canal ${can.name}`
		});
	});

	channelsConnected[channel.id] = msgCollector;

}

function disconnectFromCanal(channelId) {

	channelsConnected[channelId].stop();

	delete channelsConnected[channelId];
}

function canalConnected(channelId) {
	const canal = cache.getAllDataEntries().find( ([, channels]) => channels.includes(channelId) );
	if(canal) 
		return canal[0];
	else 
		return undefined;
}

module.exports = {
	connectToCanal,
	disconnectFromCanal,
	canalConnected
};