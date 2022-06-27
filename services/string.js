const FILE_LINE_BREAK = "\n";

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = {
	FILE_LINE_BREAK,
	capitalizeFirstLetter
};
