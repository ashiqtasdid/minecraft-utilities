const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mc = require('minecraft_head');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uuid')
		.setDescription('Enter the username to get the UUID')
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

        mc.nameToUuid(player)
        .then(data => {
          const uuid = data.uuid;
          const uuidEmbed = new EmbedBuilder()
            .setColor(0x24A5E6)
            .setTitle('Minecraft Utilities')
            .setURL('https://spectex.xyz/project/minecraft-utilities')
            .addFields(
              { name: `UUID of ${name}`, value: `\`\`\`${uuid}\`\`\`` },
            );
          interaction.editReply({
            embeds: [uuidEmbed],
            ephemeral: true,
          });
          return;
        })
        .catch((error) => {
          interaction.editReply({
            content: 'There has been an error, Please Try Again',
            ephemeral: true,
          });
          console.log(error);
        });
	},
};