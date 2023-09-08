const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
process.noDeprecation = true;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("java")
    .setDescription("Get Real-Time info about a Minecraft: Java Edition Server")
    .addStringOption((option) =>
      option
        .setName("server-ip")
        .setRequired(true)
        .setDescription("IP addess of the server")
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const ip = interaction.options.getString("server-ip");
    const apiUrl = `https://api.mcsrvstat.us/3/${ip}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.online) {
          console.log("[JAVA] " +ip);

          const javaEmbed = new EmbedBuilder()
            .setColor(0x31d533)
            .setThumbnail("attachment://icon.png")
            .setTitle("Minecraft Utilities")
            .setURL("https://spectex.xyz/projects/minecraft-utilities")
            .setDescription("**Here is the requested server status**")
            .addFields(
              { name: "**Numeric IP**", value: `\`\`\`${data.ip}\`\`\`` },
              { name: "**Server IP**", value: `\`\`\`${data.hostname}\`\`\`` },
              {
                name: "**Players Online - [Online / Max]**",
                value: `\`\`\`${data.players.online} / ${data.players.max}\`\`\``,
              },
              { name: "**Version**", value: `\`\`\`${data.version}\`\`\`` },
              {
                name: "**Gamemode**",
                value: `\`\`\`${data.gamemode || "Multiple"}\`\`\``,
              },
              {
                name: "**EULA Blocked?**",
                value: `\`\`\`${data.eula_blocked}\`\`\``,
              },
              {
                name: "**Server Mode Online?**",
                value: `\`\`\`${data.online}\`\`\``,
              },
              {
                name: "**MOTD**",
                value: `\`\`\`${data.motd.clean}\`\`\``,
              }
            );
          interaction.editReply({
            files: [
              {
                attachment: Buffer.from(data.icon.split(",")[1], "base64"),
                name: "icon.png",
              },
            ],
            components: [
              {
                type: 1,
                components: [
                  {
                    style: 5,
                    label: "Vote",
                    url: "https://top.gg/bot/810192936472936480/vote",
                    disabled: false,
                    type: 2,
                  },
                  {
                    style: 5,
                    label: "Website",
                    url: "https://spectex.xyz/projects/minecraft-utilities",
                    disabled: false,
                    type: 2,
                  },
                  {
                    style: 5,
                    label: "Support Server",
                    url: "https://discord.gg/jf28jcFJk9",
                    disabled: false,
                    type: 2,
                  },
                  {
                    style: 5,
                    label: "Documentation",
                    url: "https://mcutils.spectex.xyz",
                    disabled: false,
                    type: 2,
                  },
                ],
              },
            ],
            embeds: [javaEmbed],
          });
        } else {
          interaction.editReply({
            components: [
              {
                type: 1,
                components: [
                  {
                    style: 5,
                    label: "Vote",
                    url: "https://top.gg/bot/810192936472936480/vote",
                    disabled: false,
                    type: 2,
                  },
                  {
                    style: 5,
                    label: "Website",
                    url: "https://spectex.xyz/projects/minecraft-utilities",
                    disabled: false,
                    type: 2,
                  },
                  {
                    style: 5,
                    label: "Support Server",
                    url: "https://discord.gg/jf28jcFJk9",
                    disabled: false,
                    type: 2,
                  },
                  {
                    style: 5,
                    label: "Documentation",
                    url: "https://mcutils.spectex.xyz",
                    disabled: false,
                    type: 2,
                  },
                ],
              },
            ],
            embeds: [
              {
                type: "rich",
                title: "Minecraft Utilities",
                description: "**There has been an error**",
                color: 0xa92626,
                fields: [
                  {
                    name: "Make sure to check the following things",
                    value:
                      "``` 1. The IP of the Server. \neg: play.yourserver.com ```\n``` 2. Make sure to use the right command.\n/Java for Java Edition, /Bedrok for Bedrock.```\n\n**Here are the reasons why your server might be having trouble**\n``` 1. Your Requested Server might be offline```\n``` 2. Your Provided IP might be Incorrect```\n``` 3. There are some issues with the bot, \nin that case, please use /help```", // eslint-disable-line
                  },
                ],
              },
            ],
          });
        }
      });
  },
};
