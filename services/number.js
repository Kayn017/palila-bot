function orBit(numbers) {

	let res = numbers[0];

	for (let i = 1; i < numbers.length; i++) {
		res = res | numbers[i];
	}

	return res;
}





module.exports = {
	orBit
}