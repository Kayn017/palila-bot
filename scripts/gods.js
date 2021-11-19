const initDatabase = require("../core/database");
const process = require("process");

initDatabase().then( db => {

	if(process.argv[2] === "ADD_GOD" && process.argv[3]) {
		db.User.create({ discordid: process.argv[3], god: true });
	}

});