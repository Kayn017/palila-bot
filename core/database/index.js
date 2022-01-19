const fs = require("fs");
const { debug } = require("../../services/log");
const { Sequelize } = require("sequelize");

async function initDatabase() {
	const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USERNAME, process.env.PG_PASSWORD, {
		dialect: "postgres",
		logging: (msg) => debug(msg, "postgres", null, null),
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
	
	await sequelize.sync();

	return db;
}

module.exports = initDatabase;