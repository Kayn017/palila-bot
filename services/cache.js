
const fs = require('fs');

/**
 * Récupère une valeur dans le cache
 * @param {string} name Nom de la valeur à récupérer.
 * @param {number} ttl Temps à vivre de la valeur.
 * @param {function} callback Fonction à appeler si la valeur n'est pas présente ou que le TTL est dépassé
 */
const cache = async (name, ttl, callback) => {
    if (!fs.existsSync(`./cache/global.json`)) {
        try {
            fs.writeFileSync(`./cache/global.json`, JSON.stringify({}));
            log(`Création du fichier de cache global.json`);
        }
        catch (error) {
            err(`Impossible de créer le fichier ./cache/global.json`, null, error);
        }
    }

    const cache = JSON.parse(fs.readFileSync(`./cache/global.json`));

    let modified = false;

    // If the value is not found, we create it.
    if (!((name in cache) && ('time' in cache[name]) && ('value' in cache[name]))) {
        cache[name] = {
            time: Date.now(),
            value: await callback()
        };
        modified = true;
    }

    // If the value is expired, we invalidate the cache
    if (cache[name].time + ttl * 1000 < Date.now()) {
        cache[name] = {
            time: Date.now(),
            value: await callback()
        };
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(`./cache/global.json`, JSON.stringify(cache));
    }

    return cache[name].value;
};

const cache_age = (name) => {
    if (!fs.existsSync(`./cache/global.json`)) {
        try {
            fs.writeFileSync(`./cache/global.json`, JSON.stringify({}));
            log(`Création du fichier de cache global.json`);
        }
        catch (error) {
            err(`Impossible de créer le fichier ./cache/global.json`, null, error);
        }
    }

    const cache = JSON.parse(fs.readFileSync(`./cache/global.json`));

    // If the value is not found, we return null.
    if (!((name in cache) && ('time' in cache[name]) && ('value' in cache[name]))) {
        return null;
    }

    return cache[name].time;
};

function log(text) {
	require('./log').logStdout(text, "cache", null);
}

function err(text, msg, err) {
	require('./log').logError(text, "cache", msg ?? null, err ? err.stack : null)
}

module.exports = {cache, cache_age};
