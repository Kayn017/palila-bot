async function create(channel, avatar, reason) {
	await channel.createWebhook(channel.client.user.username, {
		avatar,
		reason
	});
}

async function get(channel) {
	const webhooks = await channel.fetchWebhooks();
	return webhooks.find(wh => wh.username === channel.client.user.username);
}


module.exports = {
	create,
	get
};