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
                embeds: [bedrockEmbed],
            });
            return;
        })
        .catch((error) => {
            console.log(error);
            interaction.editReply(`\`${error}\``);
        });
    },
};
