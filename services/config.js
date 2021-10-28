const configCore = require("../core/config");

const TYPES = [
	"command",
	"module"
];

function get(type, name, guildId, property) {
	if (!TYPES.includes(type))
		throw new Error("Type invalide");

	return configCore.redisClient.getAsync(`${type}:${name}:${guildId}:${property}`);
}

function set(type, name, guildId, property, value) {
	if (!TYPES.includes(type))
		throw new Error("Type invalide");

	configCore.redisClient.set(`${type}:${name}:${guildId}:${property}`, value);
}

module.exports = {
	get,
	set
};