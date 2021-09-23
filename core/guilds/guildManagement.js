const fs = require("fs");
const botPath = require("../../config/path.json");
const path = require("path");
const { debug } = require("../../services/log");

async function checkGuildFolders(client) {
	const guilds = await client.guilds.fetch();
	const guildsFolder = fs.readdirSync("./guilds");

	guildsFolder.forEach(folder => {

		if (!guilds.find(g => g.id === folder)) {
			backupGuildFolder(folder);
			debug(`Le bot n'est plus sur le serveur avec l'id ${folder}. Le dossier de la guild est déplacé en backup.`, "guildManagement");
		}

	});
}

function backupGuildFolder(guildId) {
	fs.renameSync(`./guilds/${guildId}`, path.join(botPath.backup, guildId));
}


module.exports = {
	checkGuildFolders,
	backupGuildFolder
};