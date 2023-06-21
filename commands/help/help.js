const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Want some help? We got you.'),
	async execute(interaction) {
        console.log('Ping was used') ;
		await interaction.reply('Pong!');
	},
};

