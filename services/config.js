const configCore = require("../core/config");

const TYPES = [
	"command",
	"module"
];

function get(type, name, guildId, property) {
	if (!TYPES.includes(type))
		throw new Error("Type invalide");

	return configCore.redisClient.get(`${type}:${name}:${guildId}:${property}`);
}

function set(type, name, guildId, property, value) {
	if (!TYPES.includes(type))
		throw new Error("Type invalide");

	if(value === undefined)
		throw new Error("Une valeur doit être défini");

	configCore.redisClient.set(`${type}:${name}:${guildId}:${property}`, value);
}

async function getKeys(type, name, guildId, property) {
	if (!TYPES.includes(type))
		throw new Error("Type invalide");

	let res = [];

	for await (const key of configCore.redisClient.scanIterator({ MATCH: `${type}:${name}:${guildId}:${property}`})) {
		res.push(key);
	}

	return res;
}

function del(type, name, guildId, property) {
	if (!TYPES.includes(type))
		throw new Error("Type invalide");

	return configCore.redisClient.del(`${type}:${name}:${guildId}:${property}`);
}

module.exports = {
	get,
	set,
	del,
	getKeys
};