
const regexp = /^\d+[jhms]$/g;

function stringToMs(strDate) {

	if (!regexp.test(strDate))
		throw new Error("Invalid string");

	const unite = strDate.charAt(strDate.length - 1);
	const time = strDate.substring(0, strDate.length - 1)

	let res;

	switch (unite) {
		case "j":
			res = time * 24 * 60 * 60 * 1000;
			break;
		case "h":
			res = time * 60 * 60 * 1000;
			break;
		case "m":
			res = time * 60 * 1000;
			break;
		case "s":
			res = time * 1000;
			break;
		default:
			throw new Error("???");
			break;
	}

	return res;
}

module.exports = {
	stringToMs
}