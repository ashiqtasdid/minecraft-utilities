const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mc = require('minecraft_head');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skin')
		.setDescription('Enter the username to get the Skin')
        .addStringOption((option) =>
      option
        .setName('player-name')
        .setDescription('Name of the player')
        .setMaxLength(30)
        .setRequired(true),
    ),
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const name = interaction.options.getString('player-name');

        console.log(name + ' is the username');
        const player = new mc.player(name);

        mc.getSkin(player)
        .then(data => {
            const skin = data.skin;
            const skinEmbed = new EmbedBuilder()
            .setColor(0x24A5E6)
            .setTitle('Minecraft Utilities')
            .setURL('https://spectex.xyz/project/minecraft-utilities')
            .addFields(
              { name: `Skin of ${name}`, value: `\`\`\`${skin}\`\`\`` },
            );
          interaction.editReply({
            components : [
              {
                'type': 1,
                'components': [
                  {
                    'style': 5,
                    'label': 'Vote',
                    'url': 'https://top.gg/bot/810192936472936480/vote',
                    'disabled': false,
                    'type': 2,
                  },
                  {
                    'style': 5,
                    'label': 'Website',
                    'url': 'https://spectex.xyz/projects/minecraft-utilities',
                    'disabled': false,
                    'type': 2,
                  },
                  {
                    'style': 5,
                    'label': 'Support Server',
                    'url': 'https://discord.gg/jf28jcFJk9',
                    'disabled': false,
                    'type': 2,
                  },
                ],
              },
            ],
            embeds: [skinEmbed],
            ephemeral: true,
          });
          return;
        })
        .catch((error) => {
          interaction.editReply({
            components: [
              {
                'type': 1,
                'components': [
                  {
                    'style': 5,
                    'label': 'Vote',
                    'url': 'https://top.gg/bot/810192936472936480/vote',
                    'disabled': false,
                    'type': 2,
                  },
                  {
                    'style': 5,
                    'label': 'Website',
                    'url': 'https://spectex.xyz/projects/minecraft-utilities',
                    'disabled': false,
                    'type': 2,
                  },
                  {
                    'style': 5,
                    'label': 'Support Server',
                    'url': 'https://discord.gg/jf28jcFJk9',
                    'disabled': false,
                    'type': 2,
                  },
                ],
              },
            ],
            embeds: [
              {
                'type': 'rich',
                'title': 'Minecraft Utilities',
                'description': '**There has been an error**.',
                'color': 0xcb3333,
                'fields': [
                  {
                    'name': 'Make sure to check the following things:\n',
                    'value': '\`\`\` 1. Check the Username. eg: Technoblade \`\`\`\n\`\`\` 2. Use the right command\neg: /skin for Skin & /UUID for UUID\`\`\`', // eslint-disable-line
                  },
                  {
                    'name': 'Here is the reason you might be having trouble:',
                    'value': '\`\`\` 1. Your Provided Username does not exist \`\`\`\n\`\`\` 2. There are some issues with the bot\nin that case, use /help\`\`\`', // eslint-disable-line
                  },
                  {
                    'name': 'Here is the error code',
                    'value': `\`\`\`${error}\`\`\``,
                  },
                ],
              },
            ],
            ephemeral: true,
          });
          console.log(error);
        });
	},
};