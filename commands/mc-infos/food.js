const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const minecraftData = require('minecraft-data');
const mcData = minecraftData('1.19');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('food')
		.setDescription('Shows info about a Minecraft Food Item.')
        .addStringOption((option) =>
        option
          .setName('food-name')
          .setRequired(true)
          .setDescription('eg: bread, cooked_beef'),
        ),
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const itemName = interaction.options.getString('food-name');
            console.log(itemName + ' was checked');
            const namei = mcData.foodsByName[itemName].displayName.toString(10);
            const stacki = mcData.foodsByName[itemName].stackSize.toString(10);
            const foodp = mcData.foodsByName[itemName].foodPoints.toString(10);
            const satur = mcData.foodsByName[itemName].saturation.toString(10);
            const foodEmbed = new EmbedBuilder()
              .setColor(0x60BEAE)
              .setTitle('Minecraft Utilities')
              .setURL('https://spectex.xyz/projects/minecraft-utilities')
              .setDescription('**Here are the informations about the food item**')
              .addFields(
                { name: 'Food Name', value: `\`\`\`${namei}\`\`\`` },
                { name: 'Stack Size', value: `\`\`\`${stacki}\`\`\`` },
                { name: 'Food Point (Higher is better)', value: `\`\`\`${foodp}\`\`\`` },
                { name: 'Saturation (Higher is better)', value: `\`\`\`${satur}\`\`\`` },
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
                      'style': 1,
                      'label': 'Help',
                      'custom_id': 'row_0_button_2',
                      'disabled': false,
                      'type': 2,
                    },
                  ],
                },
              ],
              embeds: [foodEmbed],
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