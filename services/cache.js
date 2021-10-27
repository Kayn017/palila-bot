const fs = require("fs");
const path = require("path");
const { err } = require("./log");

const CACHE_FOLDER = path.join(
	// eslint-disable-next-line no-undef
	__dirname,
	"..",
	"cache"
);

class LocalCache {

	constructor(cacheName) {
		this.cacheFile = path.join(CACHE_FOLDER, `${cacheName}.json`);
		this.name = cacheName;

		if (!fs.existsSync(this.cacheFile))
			this.data = {};
		else
			this.data = JSON.parse(fs.readFileSync(this.cacheFile));
	}

	set(property, value) {
		this.data[property] = value;
		fs.writeFile(this.cacheFile, JSON.stringify(this.data), e => { if (e) err(e, "cache", undefined, e.stack); });
	}

	get(property) {
		return this.data[property];
	}

	has(property) {
		return this.data[property] ? true : false;
	}

	delete(property) {
		delete this.data[property];
		fs.writeFile(this.cacheFile, JSON.stringify(this.data), e => { if (e) err(e, "cache", undefined, e.stack); });
	}

	getAllDataEntries() {
		return Object.entries(this.data);
	}
}

module.exports = {
	LocalCache
};