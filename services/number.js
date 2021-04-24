/** retourne un entier aleatoire compris entre 0 et max
 * 
 * @param {number} max 
 * @returns {number}
 */
function getRandomInt(max) {
	if (!max)
		throw new Exception("getRandomInt prend un paramètre");

	return Math.floor(Math.random() * Math.floor(max));
}

module.exports = { getRandomInt }