// Dot Env initizattion
const dotenv = require('dotenv');
dotenv.config();

// Discord Files
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

// New Client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Command Files

const fs = require('node:fs');
const path = require('node:path');

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
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

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.BOT_TOKEN);
