const initDatabase = require("../core/database");

async function isGod(id) {
	const db = await initDatabase();
	const user = await db.User.findOne({ where: { discordid: id } });
	return user ? user.god : false;
}

async function addGod(id) {
	const db = await initDatabase();
	const user = await db.User.findOne({ where: { discordid: id } });

	if (!user) {
		db.User.create({ discordid: id, god: true });
	} else {
		user.god = true;
		user.save();
	}
}

async function delGod(id) {
	const db = await initDatabase();
	const user = await db.User.findOne({ where: { discordid: id } });

	if (!user) {
		throw new Error("Aucun utilisateur ne correspond a cet id");
	} else {
		user.god = false;
		user.save();
	}
}

module.exports = {
	isGod,
	addGod,
	delGod,
};
