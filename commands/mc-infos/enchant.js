const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const minecraftData = require('minecraft-data');
const mcData = minecraftData('1.19');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('enchant')
		.setDescription('Shows info about a Minecraft Enchant.')
        .addStringOption((option) =>
        option
          .setName('enchant-name')
          .setRequired(true)
          .setDescription('eg: mending, unbreaking, sharpness, curse_of_binding'),
        ),
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        try {
            const itemName = interaction.options.getString('enchant-name');
            console.log(itemName + ' was checked');
            const namei = mcData.enchantmentsByName[itemName].displayName.toString(10);
            const lvli = mcData.enchantmentsByName[itemName].maxLevel.toString(10);
            const curse = mcData.enchantmentsByName[itemName].curse.toString(10);
            const excl = mcData.enchantmentsByName[itemName].exclude.toString(10);
            const trade = mcData.enchantmentsByName[itemName].tradeable.toString(10);
            const exampleEmbed = new EmbedBuilder()
              .setColor(0x36A39C)
              .setTitle('Minecraft Utilities')
              .setURL('https://spectex.xyz/projects/minecraft-utilities')
              .setDescription('**Here are the informations about the enchant**')
              .addFields(
                { name: 'Enchant Name', value: `\`\`\`${namei}\`\`\`` },
                { name: 'Max Level', value: `\`\`\`${lvli}\`\`\`` },
                { name: 'Cursed?', value: `\`\`\`${curse}\`\`\`` },
                { name: 'Not Compitable With', value: `\`\`\`${excl}\`\`\`` },
                { name: 'Tradeable?', value: `\`\`\`${trade}\`\`\`` },
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
              embeds: [exampleEmbed],
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