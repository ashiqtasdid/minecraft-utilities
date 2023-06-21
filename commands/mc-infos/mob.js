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
          embeds: [mobEmbed],
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
                  'value': '\`\`\` 1. The name of the Requested Mob.\n Replace any space with an underscore (_).\neg: ender_dragon, villager, iron_golem\`\`\`\n\`\`\` 3. Make sure to use the right command.\nuse /mob to get info about a Minecraft Mob\`\`\`\n\n**Here are the reasons why you might be having trouble**\n\`\`\` 1. Your Requested Mob is not in the game\`\`\`\n\`\`\` 2. Your Provided Name might be Incorrect\`\`\`\n\`\`\` 3. There are some issues with the bot, \nin that case, please use /help\`\`\`', // eslint-disable-line
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