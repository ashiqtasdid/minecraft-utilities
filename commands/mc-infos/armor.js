const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const minecraftData = require('minecraft-data');
const mcData = minecraftData('1.19');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('armor')
		.setDescription('Shows info about a Minecraft Armor.')
        .addStringOption((option) =>
        option
          .setName('item-name')
          .setRequired(true)
          .setDescription('eg: iron_helmet, diamond_leggings, netherite_boots'),
      ),
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

    try {
        const itemName = interaction.options.getString('item-name');
        console.log(itemName + ' was checked');
        const namei = mcData.itemsByName[itemName].displayName.toString(10);
        const stacki = mcData.itemsByName[itemName].stackSize.toString(10);
        const repair = mcData.itemsByName[itemName].repairWith.toString(10);
        const durable = mcData.itemsByName[itemName].maxDurability.toString(10);
        const armorEmbed = new EmbedBuilder()
          .setColor(0x89A9B3)
          .setTitle('Minecraft Utilities')
          .setURL('https://spectex.xyz/projects/minecraft-utilities')
          .setDescription('**Here are the informations about the armor**')
          .addFields(
            { name: 'Item Name', value: `\`\`\`${namei}\`\`\`` },
            { name: 'Stack Size', value: `\`\`\`${stacki}\`\`\`` },
            { name: 'Repairable with', value: `\`\`\`${repair}\`\`\`` },
            { name: 'Durability', value: `\`\`\`${durable}\`\`\`` },
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
          embeds: [armorEmbed],
          ephemeral: true,
        });
      } catch (error) {
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
              'description': '**There has been an error**',
              'color': 0xa92626,
              'fields': [
                {
                  'name': 'Make sure to check the following things',
                  'value': '\`\`\` 1. The name of the Requested Armor.\n Replace any space with an underscore (_).\neg: iron_helmet, netherite_boots, leather_chestplate\`\`\`\n\`\`\` 3. Make sure to use the right command.\nuse /Armor to get info about a Minecraft Armor\`\`\`\n\n**Here are the reasons why you might be having trouble**\n\`\`\` 1. Your Requested Armor is not in the game\`\`\`\n\`\`\` 2. Your Provided Name might be Incorrect\`\`\`\n\`\`\` 3. There are some issues with the bot, \nin that case, please use /help\`\`\`', // eslint-disable-line
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
      }
      return;
	},
};