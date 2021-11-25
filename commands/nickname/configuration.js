const config = require("../../services/config");
const { log } = require("../../services/log");

module.exports = {
	keepPseudo(interaction, value) {
		if (!["true", "false"].includes(value))
			return interaction.reply({ content: "Valeur invalide ! Attendue : `true` ou `false`", ephemeral: true });

		config.set("command", this.name, interaction.guild.id, "keepPseudo", value === "true");

		log(`Changement de la propriété keepPseudo (nouvelle valeur : ${value})`, "nickname", interaction);

		return interaction.reply({ content: "Propriété changée", ephemeral: true });
	}
};