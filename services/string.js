/**
 * 
 * @param {String} value 
 * @param {String[]} tags 
 * @returns 
 */
function match(value, tags) {
	const tokens = value.toLowerCase().split(' ');
	const chain = tags.map((data) => data?.toLowerCase())
		.join(' ')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
	return tokens.every((token) => (
		chain.includes(token.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
	));
}

function normalize(value) {
	return value?.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

module.exports = { match, normalize }