const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mcs = require('node-mcstatus');
process.noDeprecation = true;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bedrock')
    .setDescription('Get Real-Time info about a Minecraft: Bedrock Edition Server')
    .addStringOption((option) =>
      option
        .setName('server-ip')
        .setRequired(true)
        .setDescription('IP addess of the server'),
    )
    .addStringOption((option) =>
      option
      .setName('server-port')
      .setDescription('Port of the server [Type Default for Default Port]')
      .setRequired(true),
    ),
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true });

        let port = interaction.options.getString('server-port').toLowerCase();
        const ip = interaction.options.getString('server-ip');

        if (port == 'default')
        {
            port = 19132;
        }

        mcs.statusBedrock(ip, port)

        .then((result) => {
            console.log(ip + ', ' + port);

            const bedrockEmbed = new EmbedBuilder()
            .setColor(0x31D533)
            .setTitle('Minecraft Utilities')
            .setURL('https://spectex.xyz/projects/minecraft-utilities')
            .setDescription('**Here is the requested server status**')
            .addFields(
                { name: '**Players Online**', value: `\`\`\`${result.players.online}\`\`\`` },
                { name: '**Max Player Cap**', value: `\`\`\`${result.players.max}\`\`\`` },
                { name: '**Server Version**', value: `\`\`\`${result.version.name_clean}\`\`\`` },
                { name: '**Online Mode**', value: `\`\`\`${result.online}\`\`\`` },
                { name: '**Is The Eula Blocked ?**', value: `\`\`\`${result.eula_blocked}\`\`\`` },
                { name: '**Mods, [ ] = No Mods**', value: `\`\`\`[${result.mods}]\`\`\`` },
                { name: '**Motd**', value: `\`\`\`${result.motd.clean.trim()}\`\`\`` },
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
                embeds: [bedrockEmbed],
            });
            return;
        })
        .catch((error) => {
            console.log('There has been an error');
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
                      'value': '\`\`\` 1. The IP of the Server. \neg: play.yourserver.com, 103.144.xxx.xxx \`\`\`\n\`\`\` 2. The PORT of the server. \neg: 19132 [Default].\`\`\`\n\`\`\` 3. Make sure to use the right command.\n/Java for Java Edition, /Bedrok for Bedrock.\`\`\`\n\n**Here are the reasons why your server might be having trouble**\n\`\`\` 1. Your Requested Server might be offline\`\`\`\n\`\`\` 2. Your Provided IP or PORT might be Incorrect\`\`\`\n\`\`\` 3. There are some issues with the bot, \nin that case, please use /help\`\`\`', // eslint-disable-line
                    },
                    {
                      'name': 'Here is the error code',
                      'value': `\`\`\`${error}\`\`\``,
                    },
                  ],
                },
              ],
            });
        });
    },
};
