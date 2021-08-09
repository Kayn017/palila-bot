# Palila Bot

Un super bot permettant de faire pleins de trucs !

 
## À propos

Le palila bot est un bot Discord polyvalent et modulaire qui ajoute des fonctionnalités inédites, comme :
- Télécharger des images et vidéos d'un channel
- Récolter et envoyer des citations 
- Participer à la loterie de [David Lynch](https://www.youtube.com/c/DAVIDLYNCHTHEATER/videos)
- Faire des blagounettes extrêmement drôle 👀

Le bot est entièrement open source, n'hésitez pas à le reprendre et/ou à ajouter de nouvelles fonctionnalités au bot.

## Téléchargement 

Téléchargez l'archive zip [ici](https://github.com/Kayn017/palila-bot/archive/refs/heads/main.zip) ou utilisez la commande 
```
git clone https://github.com/Kayn017/palila-bot.git
```

## Installation et configuration

Pour installer les dépendances, ouvrez un terminal et tapez la commande 
```bash
# avec npm
npm install

# avec yarn
yarn install
```

Pour lancer le bot, il suffit d'utiliser la commande 
```bash
# avec npm
npm start

# avec yarn
yarn start
```

Si c'est la première fois que vous lancez le bot, celui-ci va créer les fichiers de configuration et va planter (c'est fait exprès).

Ouvrez le fichier `config/config.json` et remplissez le comme ceci 
```json
{
	"discord": {
		"token": "Le token du bot¹",
		"gods": [
			"l'id d'un utilisateur god²"
		]
	},
	"prefix": "," // préfixe par défaut du bot
}
```
¹ : le token du bot est trouvable sur le [portail développeur de Discord](https://discord.com/developers/applications) <br>
² : un utilisateur god a tout les droits sur le bot. Veillez à ne mettre que l'identifiant de personnes de confiance.

Relancez le bot et un message devrait apparaitre vous indiquant que le bot est connecté !

## Licence

Le Palila Bot est sous [licence MIT](LICENCE.md).