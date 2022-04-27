const fs = require("fs");
const path = require("path");

function loadDriver(url) {

	const drivers = fs.readdirSync(__dirname).filter(name => !name.endsWith(".js"));

	for(const driverName of drivers) {

		const driver = require(path.join(__dirname, driverName));

		if(driver.triggerByURL(url)) {
			return driver;
		}
	}
}


module.exports = loadDriver;