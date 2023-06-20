const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const minecraftData = require('minecraft-data');
const mcData = minecraftData('1.19');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('block')
		.setDescription('Shows info about a Minecraft Block.')
        .addStringOption((option) =>
        option
          .setName('block-name')
          .setRequired(true)
          .setDescription('eg: bedrock, oak_wood, obsidian, honey_block'),
      ),
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
      const blockName = interaction.options.getString('block-name');

      console.log(blockName + ' was checked');

      const namem = mcData.blocksByName[blockName].displayName.toString(10);
      const minem = mcData.blocksByName[blockName].diggable.toString(10);
      const stackm = mcData.blocksByName[blockName].stackSize.toString(10);
      const mmb = mcData.blocksByName[blockName].material.toString(10);
      const objtype = mcData.blocksByName[blockName].boundingBox.toString(10);
      const hard = mcData.blocksByName[blockName].hardness.toString(10);

      const light = mcData.blocksByName[blockName].emitLight.toString(10);

      const blockEmbed = new EmbedBuilder()
        .setColor(0x42B05B)
        .setTitle('Minecraft Utilities')
        .setURL('https://spectex.xyz/projects/minecraft-utilities')
        .setDescription('**Here are the informations about the block**')
        .addFields(
          { name: 'Block Name', value: `\`\`\`${namem}\`\`\`` },
          { name: 'Mineable', value: `\`\`\`${minem}\`\`\`` },
          { name: 'Stack Size', value: `\`\`\`${stackm}\`\`\`` },
          { name: 'Mineable with (Default = Not Mineable)', value: `\`\`\`${mmb}\`\`\`` },
          { name: 'Object Type', value: `\`\`\`${objtype}\`\`\`` },
          {
            name: 'Does it emit light? ( >0 (greater than 0), means it emits light)',
            value: `\`\`\`${light}\`\`\``,
          },
          {
            name: 'Hardness (Higher Means, It takes more time to mine)',
            value: `\`\`\`${hard}\`\`\``,
          },
        );

      interaction.editReply({

        embeds: [blockEmbed],
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