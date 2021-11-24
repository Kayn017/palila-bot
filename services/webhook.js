async function create(channel, avatar, reason) {
	await channel.createWebhook(channel.client.user.username, {
		avatar,
		reason
	});
}

async function get(channel) {
	const webhooks = await channel.fetchWebhooks();
	return [...webhooks.values()].find(wh => wh.name === channel.client.user.username);
}


module.exports = {
	create,
	get
};