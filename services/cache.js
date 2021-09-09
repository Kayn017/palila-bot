const fs = require('fs');
const path = require('path');
const { err } = require('./log');


const CACHE_FOLDER = `./cache`;


class LocalCache {

	cacheFile;
	name;
	data;

	constructor(cacheName) {

		this.cacheFile = path.join(CACHE_FOLDER, `${cacheName}.json`);
		this.name = cacheName;

		if (!fs.existsSync(this.cacheFile))
			this.data = {}
		else
			this.data = JSON.parse(fs.readFileSync(this.cacheFile))
	}

	set(property, value) {
		this.data[property] = value;
		fs.writeFile(this.cacheFile, JSON.stringify(this.data), e => err(e, "cache.js", undefined, e.stack));
	}

	get(property) {
		return this.data[property];
	}
}


module.exports = {
	LocalCache
};