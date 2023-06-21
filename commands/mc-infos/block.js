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
        embeds: [blockEmbed],
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
                'value': '\`\`\` 1. The name of the Requested Block\n Replace space with an underscore (_).\neg: oak_wood, diamond_block, obsidian\`\`\`\n\`\`\` 3. Make sure to use the right command.\nuse /block to get info about a Minecraft block.\`\`\`\n\n**Here are the reasons why you might be having trouble**\n\`\`\` 1. Your Requested Block is not in the game\`\`\`\n\`\`\` 2. Your Provided Name might be Incorrect\`\`\`\n\`\`\` 3. There are some issues with the bot, \nin that case, please use /help\`\`\`', // eslint-disable-line
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