module.exports = {
	name: "disconnect",
	description: "Déconnecte un channel du canal ou il est connecté",
	explication: "",
	author: "Kayn",
	options: [{
		name: "salon",
		type: "CHANNEL",
		description: "Channel a déconnecter",
		required: false,
	}],
	intents: [],
	permissions: [],
	globalCommand: false,
};
