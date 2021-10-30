const config = require("../../services/config");
const { DiscordAPIError } = require("discord.js");
const { err, log } = require("../../services/log");

const NICKNAME_MAX_SIZE = 32;

function init() {

}
function shutdown() {

}
async function execute(interaction, options) {

	const keepPseudo = (await config.get("command", this.name, interaction.guild.id, "keepPseudo")) === "true";
	const newPseudo = options.find(o => o.name === "surnom")?.value;

	let actualNickname = interaction.member.displayName;

	const name = actualNickname.includes("/") ? actualNickname.split("/").pop().trim() : actualNickname;

	let newNickname;

	if (!newPseudo) {
		if (keepPseudo)
			newNickname = name;
		else
			newNickname = null;
	}
	else {
		if (keepPseudo)
			newNickname = `${newPseudo} / ${name}`;
		else
			newNickname = newPseudo;
	}

	if (newNickname && newNickname.length > NICKNAME_MAX_SIZE)
		return interaction.reply({ content: "Ce pseudo est trop long :/", ephemeral: true });


	try {
		await interaction.member.setNickname(newNickname);
	} catch (e) {
		if (e instanceof DiscordAPIError && e.message === "Missing Permissions")
			return interaction.reply({ content: "Je n'ai pas les permissions pour te renommer :/ Regarde avec les admins du serveur pour me mettre les permissions", ephemeral: true });
		else {
			err("Impossible de changer le nickname", "nickname", interaction, e.stack);
			return interaction.reply({ content: "Y'a problème la :thinking:", ephemeral: true });
		}
	}

	if (newPseudo)
		interaction.reply({ content: "Pseudo changé !", ephemeral: true });
	else
		interaction.reply({ content: "Pseudo enlevé !", ephemeral: true });
}
async function middleware() {

}
async function configure(property, value, interaction) {

	switch (property) {
	case "keepPseudo":
		if (!["true", "false"].includes(value))
			return interaction.reply({ content: "Valeur invalide ! Attendue : `true` ou `false`", ephemeral: true });
		config.set("command", this.name, interaction.guild.id, "keepPseudo", value === "true");
		log(`Changement de la propriété keepPseudo (nouvelle valeur : ${value})`, "nickname", interaction);
		return interaction.reply({ content: "Propriété changée", ephemeral: true });
	}

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
	configure,
};
