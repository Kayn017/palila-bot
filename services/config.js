const configCore = require("../core/config");

const TYPES = [
	"command",
	"module"
];

async function get(type, name, guildId, property) {
	if (!TYPES.includes(type))
		throw new Error("Type invalide");

	return configCore.redisClient.asyncGet(`${type}:${name}:${guildId}:${property}`);
}

async function set(type, name, guildId, property) {
	if (!TYPES.includes(type))
		throw new Error("Type invalide");

	configCore.redisClient.asyncSet(`${type}:${name}:${guildId}:${property}`);
}

module.exports = {
	get,
	set
};