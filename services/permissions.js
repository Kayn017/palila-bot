const configCore = require("../core/config");

async function isGod(id) {
	const gods = await configCore.redisClient.getAsync("global:gods");
	return gods.includes(id);
}

async function addGod(id) {
	let gods = await configCore.redisClient.getAsync("global:gods");

	if (!gods) {
		gods = [];
	}
	else {
		gods = gods.split(",");
	}

	gods.push(id);

	configCore.redisClient.set("global:gods", gods.join(","));
}

async function delGod(id) {
	let gods = await configCore.redisClient.getAsync("global:gods");

	if (!gods) {
		gods = [];
	}
	else {
		gods = gods.split(",");
	}

	if (!gods.includes(id)) {
		throw new Error("L'utilisateur donné n'est pas un utilisateur god");
	}

	gods.splice(gods.indexOf(id), 1);
	configCore.redisClient.set("global:gods", gods.join(","));
}

module.exports = {
	isGod,
	addGod,
	delGod
};