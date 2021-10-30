const db = require("../core/database/index");

async function isGod(id) {
	return (await db.User.findOne({ where: { discordid: id } })).god;
}

async function addGod(id) {
	const user = await db.User.findOne({ where: { discordid: id } });

	if (!user) {
		db.User.create({ discordid: id, god: true });
	}
	else {
		user.god = true;
		user.save();
	}
}

async function delGod(id) {
	const user = await db.User.findOne({ where: { discordid: id } });

	if (!user) {
		throw new Error("Aucun utilisateur ne correspond a cet id");
	}
	else {
		user.god = false;
		user.save();
	}
}

module.exports = {
	isGod,
	addGod,
	delGod
};