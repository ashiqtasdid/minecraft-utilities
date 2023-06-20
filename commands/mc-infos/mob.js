const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const minecraftData = require('minecraft-data');
const mcData = minecraftData('1.19');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mob')
		.setDescription('Show info about a Minecraft Mob')
        .addStringOption((option) =>
        option
          .setName('mob-name')
          .setRequired(true)
          .setDescription('eg: zombie, ravager, villager, ender_dragon'),
        ),
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
    try {
        const mobName = interaction.options.getString('mob-name');
        console.log(mobName);
        const namei = mcData.entitiesByName[mobName].displayName.toString(10);
        const heighti = mcData.entitiesByName[mobName].height.toString(10);
        const type = mcData.entitiesByName[mobName].type.toString(10);
        const category = mcData.entitiesByName[mobName].category.toString(10);
          const mobEmbed = new EmbedBuilder()
          .setColor(0x6081BE)
          .setTitle('Minecraft Utilities')
          .setURL('https://spectex.xyz/projects/minecraft-utilities')
          .setDescription('**Here are the informations about the mob**')

          .addFields(
            { name: 'Mob Name', value: `\`\`\`${namei}\`\`\`` },
            { name: 'Mob Height (Blocks)', value: `\`\`\`${heighti}\`\`\`` },
            { name: 'Mob Type', value: `\`\`\`${type}\`\`\`` },
            { name: 'Mob Category', value: `\`\`\`${category}\`\`\`` },
          );
        interaction.editReply({
          embeds: [mobEmbed],
          ephemeral: true,
        });
      } catch (error) {
        interaction.editReply({
          content: 'There has been an error, Please Try Again',
          ephemeral: true,
        });
      }
      return;
	},
};