const fs = require('fs');

function havePermission(id, guildID, roles) {

	const config = JSON.parse(fs.readFileSync(`./config/config.json`));

	if (config.discord.gods.includes(id))
		return true;

	if (!guildID)
		return false;

	const guildConfig = JSON.parse(fs.readFileSync(`./guilds/${guildID}/config.json`));

	let res = false;

	for (const roleID of roles) {
		if (guildConfig.adminRoles.includes(roleID)) {
			res = true;
			break;
		}
	}
	return res;
}


module.exports = {
	havePermission
}