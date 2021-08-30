const process = require("process");
const fs = require('fs');

const TOKEN_SIZE = 61;

function waitForUser() {
	let answer = Buffer.alloc(TOKEN_SIZE);

	process.stdin.resume();

	fs.readSync(process.stdin.fd, answer);

	let answerString = answer.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/\0/g, '');

	process.stdin.pause();

	return answerString;
}

module.exports = {
	waitForUser
}