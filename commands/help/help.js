const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Want some help? We got you.'),
  async execute(interaction) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('help')
      .setPlaceholder('Select a category')
      .setMaxValues(1)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Bot')
          .setDescription('Want some help with the bot?')
          .setValue('BOT_HELP'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Commands')
          .setDescription('Want some help with commands? We got you')
          .setValue('COMMANDS_HELP'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Contact')
          .setDescription('Let\'s get in touch!')
          .setValue('CONTACT_HELP'),
      );

    const row = new ActionRowBuilder()
      .addComponents(menu);

    try {
      await interaction.reply({ content: 'Select a category from below to get help', components: [row], ephemeral: true });
    } catch (error) {
      console.error('[WARNING][DO NOT REPORT][NOT AN ERROR][FROM HELP.JS] Error replying to interaction:', error);
      return;
    }

    const filter = (i) => i.customId === 'help' && i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async (i) => {
      try {
        if (i.values[0] === 'BOT_HELP') {
          const botEmbed = {
            color: 0x0099ff,
            title: 'Bot Info & Queries',
            url: 'https://spectex.xyz/projects/minecraft-utilities',
            fields: [
              {
                name: 'Discord Server',
                value: 'https://discord.gg/jf28jcFJk9',
              },
              {
                name: 'Website',
                value: 'https://spectex.xyz/projects/minecraft-utilities',
              },
              {
                name: 'Vote',
                value: 'https://top.gg/bot/810192936472936480/vote',
              },
            ],
            timestamp: new Date(),
          };
          await i.update({ embeds: [botEmbed], components: [], ephemeral: true });
        } else if (i.values[0] === 'COMMANDS_HELP') {
          const commandsEmbed = {
            color: 0x0099ff,
            title: 'Command Infos & Queries',
            url: 'https://spectex.xyz/projects/minecraft-utilities',
            fields: [
              {
                name: 'Website',
                value: 'https://spectex.xyz/projects/minecraft-utilities/commands',
              },
              {
                name: 'Discord Server',
                value: 'https://discord.gg/jf28jcFJk9',
              },
            ],
            timestamp: new Date(),
          };
          await i.update({ embeds: [commandsEmbed], components: [], ephemeral: true });
        } else if (i.values[0] === 'CONTACT_HELP') {
          const contactEmbed = {
            color: 0x0099ff,
            title: 'Contact Us',
            url: 'https://spectex.xyz/projects/minecraft-utilities',
            fields: [
              {
                name: 'Contact',
                value: 'https://spectex.xyz/contact',
              },
              {
                name: 'Discord Server',
                value: 'https://discord.gg/jf28jcFJk9',
              },
              {
                name: 'Email',
                value: 'support@spectex.xyz',
              },
            ],
            timestamp: new Date(),
          };
          await i.update({ embeds: [contactEmbed], components: [], ephemeral: true });
        }
      } catch (error) {
        console.error('[WARNING][DO NOT REPORT][NOT AN ERROR][FROM HELP.JS] Error replying to interaction');
      }
    });

    collector.on('end', async (collected) => {
      if (collected.size === 0) {
        try {
          await interaction.followUp({ content: 'You did not select any options in time.', components: [], ephemeral: true });
        } catch (error) {
          console.error('Error sending follow-up message:', error);
        }
      }
    });
  },
};
