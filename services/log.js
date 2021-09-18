const fs = require("fs");
const os = require("os");
const process = require("process");

function log(text, filename, message = null) {

	const now = new Date();

	let display = `[${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}][${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}][${filename}.js]`;

	if (message) {
		if (message.guild)
			display += `[${message.guild.name}]`;
		if (message.channel)
			display += `[${message.channel.name}]`;
	}

	display += ` ${text}`;

	console.log(display);

	const stream = fs.createWriteStream("./log/log.txt", { "flags": "a" });
	stream.once("open", () => {
		stream.write(display + os.EOL);

		stream.close();
	});
}

function err(error, filename, message = null, stack = null) {

	const now = new Date();

	let display = `[${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}][${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}][${filename}.js]`;

	if (message) {
		if (message.guild)
			display += `[${message.guild.name}]`;
		if (message.channel)
			display += `[${message.channel.name}]`;
	}

	display += `ERREUR : ${error}`;

	console.error(display);

	if (stack)
		console.error(stack);

	const stream = fs.createWriteStream("./log/error.txt", { "flags": "a" });
	stream.once("open", () => {
		stream.write(display + os.EOL);

		if (stack)
			stream.write(stack + os.EOL);

		stream.close();
	});
}

function debug(text, filename, message = null, stack = null) {

	if (!process.argv.includes("--VERBOSE"))
		return;

	const now = new Date();

	let display = `[${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}][${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}][${filename}.js]`;

	if (message) {
		if (message.guild)
			display += `[${message.guild.name}]`;
		if (message.channel)
			display += `[${message.channel.name}]`;
	}

	display += ` ${text}`;

	console.log(display);

	if (stack)
		console.error(stack);

	const stream = fs.createWriteStream("./log/debug.txt", { "flags": "a" });
	stream.once("open", () => {
		stream.write(display + os.EOL);

		if (stack)
			stream.write(stack + os.EOL);

		stream.close();
	});
}

function fatalError(text, filename, message = null, stack = null) {

	const now = new Date();

	let display = `[${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}][${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}][${filename}.js]`;

	if (message) {
		if (message.guild)
			display += `[${message.guild.name}]`;
		if (message.channel)
			display += `[${message.channel.name}]`;
	}

	display += ` ${text}`;

	console.error(display);

	if (stack)
		console.error(stack);


	const stream = fs.createWriteStream("./log/fatal.txt", { "flags": "a" });
	stream.once("open", () => {
		stream.write(display + os.EOL);

		if (stack)
			stream.write(stack + os.EOL);

		stream.close();
	});
}

module.exports = {
	log,
	err,
	debug,
	fatalError
};