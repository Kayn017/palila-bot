const { createAudioPlayer, NoSubscriberBehavior } = require("@discordjs/voice");

const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause
	}
});

module.exports = player;