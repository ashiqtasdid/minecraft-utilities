// Dot Env initizattion
const dotenv = require('dotenv');
dotenv.config();

// Discord Files
const { Client, GatewayIntentBits, Collection } = require('discord.js');

// New Client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Command Files

const fs = require('node:fs');
const path = require('node:path');

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Event Handler

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


// TOP.GG Auto Post
const { AutoPoster } = require('topgg-autoposter')

const ap = AutoPoster(process.env.TOP_GG_TOKEN, client)

ap.on('posted', () => {
  console.log('Posted stats to Top.gg!')
})

client.login(process.env.BOT_TOKEN);