function orBit(numbers) {

	let res = numbers[0];

	for (let i = 1; i < numbers.length; i++) {
		res = res | numbers[i];
	}
	return res;
}

function getRandomInt(max) {
	if (!max)
		throw new Error("Pas d'argument envoyé");

	return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
	orBit,
	getRandomInt
};