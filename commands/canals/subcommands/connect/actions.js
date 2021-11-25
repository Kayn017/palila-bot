const { canalConnected, connectToCanal, disconnectFromCanal } = require("../../../../services/canals");
const { log } = require("../../../../services/log");
const WebHook = require("../../../../services/webhook");
const { LocalCache } = require("../../../../services/cache");
const { TextChannel } = require("discord.js");
const cache = LocalCache.get("canals");

async function init(client) {
	const options = [];

	const canals = await client.db.Canal.findAll();

	canals.forEach( canal => {
		options.push({ name: canal.name, value: "" + canal.id });
	});

	this.options[0].choices = options;
}
function shutdown() {

}
async function execute(interaction, options) {

	const id = options.find(o => o.name === "canal").value;
	const chan = options.find(o => o.name === "salon")?.value ?? interaction.channel.id;

	const channel = await interaction.client.channels.fetch(chan);
	
	if(!(channel instanceof TextChannel)) 
		return interaction.reply({
			content: "Ce channel n'est pas valide. Seul les channels textuels sont compatible.",
			ephemeral: true
		});

	const canal = await interaction.client.db.Canal.findOne({ where: { id } });

	if (canal === null) {
		return interaction.reply({
			content: "Ce canal n'existe pas",
			ephemeral: true,
		});
	}

	const canalAlreadyConnected = canalConnected(chan);

	if(canalAlreadyConnected === id) {
		return interaction.reply({
			content: "Ce channel est déjà connecté a ce canal",
			ephemeral: true
		});
	} else if(canalAlreadyConnected) {
		const canalDb = await interaction.client.db.Canal.findOne({ where: { id: canalAlreadyConnected } });
		canalDb.nbChannelsConnected--;
		canalDb.save();
		disconnectFromCanal(chan, id);
	}

	let channels = cache.get(id);
	if(!channels) 
		channels = [];
	channels.push(channel.id);
	cache.set(id, channels);

	await connectToCanal(channel, id, interaction.client);

	canal.nbChannelsConnected++;
	canal.save();

	if(!(await WebHook.get(channel)))
		WebHook.create(channel, interaction.client.user.avatarURL(), "Ce WebHook est nécessaire pour le fonctionnement de la commande canals du bot");

	log(`Connexion du channel avec l'id ${chan} au canal ${canal.name}`, "canals connect", interaction);
	interaction.reply({ content: "Channel connecté !", ephemeral: true });
}
async function middleware() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};
