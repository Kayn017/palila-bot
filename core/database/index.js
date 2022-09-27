const fs = require("fs");
const { debug } = require("../../services/log");
const { Sequelize } = require("sequelize");

async function initDatabase() {
	const sequelize = new Sequelize(process.env.MARIADB_DB, process.env.MARIADB_USER, process.env.MARIADB_PASSWORD, {
		host: process.env.MARIADB_HOST,
		port: process.env.MARIADB_PORT,
		dialect: "mariadb",
		logging: (msg) => debug(msg, "mariadb", null, null),
	});
	
	const db = {};
	
	fs.readdirSync("./models")
		.filter((filename) => filename.endsWith(".js"))
		.forEach((filename) => {
			const model = require(`../../models/${filename}`)(sequelize);
			db[model.name] = model;
		});
	
	Object.keys(db).forEach((modelName) => {
		db[modelName].associate(db);
	});
	
	await sequelize.sync({ alter: true });

	return db;
}

module.exports = initDatabase;