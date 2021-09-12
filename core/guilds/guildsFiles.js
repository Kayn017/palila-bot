const fs = require("fs");
const template = require("../../templates/guildFolder.json");
const { debug } = require("../../services/log");

function createGuildsFiles(guilds) {

	for (const [id, guild] of guilds) {

		if (!fs.existsSync(`./guilds/${id}`)) {
			fs.mkdirSync(`./guilds/${id}`);
			debug(`Dossier de guild ${id} créé.`, "guildsFiles");
		}

		for (const [filename, fileContent] of Object.entries(template)) {

			if (!fs.existsSync(`./guilds/${id}/${filename}.json`))
				fs.writeFileSync(`./guilds/${id}/${filename}.json`, JSON.stringify(fileContent));

		}

		initGuildConfigFile(guild);
	}
}

function initGuildConfigFile(guild) {

	const fileContent = JSON.parse(fs.readFileSync(`./guilds/${guild.id}/config.json`));

	fileContent.name = guild.name;

	fs.writeFileSync(`./guilds/${guild.id}/config.json`, JSON.stringify(fileContent));

}



module.exports = {

	createGuildsFiles

};