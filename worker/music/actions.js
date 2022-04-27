const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require("@discordjs/voice");
const { readdirSync } = require("fs");
const path = require("path");
const { parentPort } = require("worker_threads");
const { debug } = require("../../services/log");

async function execute(client, options) {

	const channel = await client.channels.fetch(options.channelId);

	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator
	});

	debug("Connexion créée !", "music worker");
	debug("Options : " + JSON.stringify(options), "music worker");


	// handle disconnection
	connection.on(VoiceConnectionStatus.Disconnected, async () => {
		try {
			await Promise.race([
				entersState(connection, VoiceConnectionStatus.Signalling, 5000),
				entersState(connection, VoiceConnectionStatus.Connecting, 5000)
			]);
		}
		catch(error) {
			connection.destroy();
			process.exit(0);
		} 
	});

	parentPort.on("message", msg => {

		debug("Message reçu : " + JSON.stringify(msg), "music worker");

		const actions = readdirSync(path.join(__dirname, "actions"));
		const action = actions.find( action => action.startsWith(msg.action) );

		require(path.join(__dirname, "actions", action))(connection, msg);
	});

	process.on("exit", () => {
		connection.destroy();
	});
}

module.exports = {
	execute,
};
