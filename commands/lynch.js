const rssparser = require("rss-parser");
const fs = require('fs');

const parser = new rssparser();

const LYNCH_CHANNEL_ID = "UCDLD_zxiuyh1IMasq9nbjrA"

const name = `lynch`
const synthax = `${name}`
const description = ""
const explication = ""
const author = "Kayn"


async function execute(message, args) {

	let lynchPostedVideos = [];

	if (!fs.existsSync(`./resources/lynch.json`))
		fs.writeFileSync(`./resources/lynch.json`, JSON.stringify([]));
	else
		lynchPostedVideos = JSON.parse(fs.readFileSync(`./resources/lynch.json`));

	parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${LYNCH_CHANNEL_ID}`)
		.then(data => {
			const latestVideo = data.items[0];

			if (lynchPostedVideos.includes(latestVideo.link))
				return;

			message.channel.send(`Nouvelle vidéo de David Lynch ! \n${latestVideo.link}`)

			lynchPostedVideos.push(latestVideo.link);

			fs.writeFileSync(`./resources/lynch.json`, JSON.stringify(lynchPostedVideos))
		})

}



module.exports = { name, synthax, description, explication, author, execute };