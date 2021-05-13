const Discord = require('discord.js')
const { fetch } = require('../services/http')

const name = "rtx_checker"

const description = "check for rtx"

const CLIENT_ID = "371285073191895072"
const API_URL = "https://api.nvidia.partners/edge/product/search?page=1&limit=9&locale=fr-fr&gpu=RTX%203060%20TI&gpu_filter=RTX%203090~12,RTX%203080~18,RTX%203070~21,RTX%203060%20TI~10,RTX%203060~15,RTX%202080%20SUPER~9,RTX%202080~10,RTX%202070%20SUPER~9,RTX%202070~16,RTX%202060~28,GTX%201660%20TI~17,GTX%201660%20SUPER~7,GTX%201660~2,GTX%201650%20TI~5,GTX%201650~17"
let avaible = false;

function init(client) {

	client.on('ready', () => {

		setInterval(() => {
			checkStock(client)
		},
			30 * 1000)

	})

}

async function checkStock(client) {

	const response = await fetch(API_URL);

	const JSONresponse = JSON.parse(response)

	if (JSONresponse.searchedProducts.featuredProduct.productAvailable && !avaible) {

		const user = await client.users.fetch(CLIENT_ID)

		const embed = new Discord.MessageEmbed()
			.setTitle(JSONresponse.searchedProducts.featuredProduct.displayName + " en stock !")
			.setDescription("Des exemplaires sont disponible !")
			.setImage(JSONresponse.searchedProducts.featuredProduct.imageURL)
			.setColor(0x1e80d6)
			.setURL("https://shop.nvidia.com/fr-fr/geforce/store/gpu/?page=1&limit=9&locale=fr-fr&gpu=RTX%203060%20Ti,RTX%203060%20TI&category=GPU&gpu_filter=RTX%203090~12,RTX%203080~18,RTX%203070~19,RTX%203060%20TI~10,RTX%203060~11,RTX%202080%20SUPER~0,RTX%202080~0,RTX%202070%20SUPER~0,RTX%202070~0,RTX%202060~2,GTX%201660%20TI~0,GTX%201660%20SUPER~7,GTX%201660~2,GTX%201650%20TI~0,GTX%201650~4")

		user.send(embed)
	}

	avaible = JSONresponse.searchedProducts.featuredProduct.productAvailable

}

module.exports = { name, description, init };