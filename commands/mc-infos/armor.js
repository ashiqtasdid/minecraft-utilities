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
          embeds: [armorEmbed],
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