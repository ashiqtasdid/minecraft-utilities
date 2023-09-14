const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mc = require("minecraft_head");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Get Minecraft player profile")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Minecraft player name")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const playerName = interaction.options.getString("name");

    try {
      // Retrieve UUID using minecraft_head
      const player = new mc.player(playerName);

      // Use the promise-based approach to get the UUID
      const uuidData = await mc.nameToUuid(player);

      if (!uuidData || !uuidData.uuid) {
        throw new Error("UUID not found");
      }

      const uuid = uuidData.uuid;

      // Fetch full body image
      const bodyImageUrl = `https://api.mineatar.io/body/full/${uuid}`;

      console.log('UUID:', uuid); // Debug: Log the UUID
      console.log('bodyImageUrl:', bodyImageUrl); // Debug: Log the image URL

      // Fetch skin and cape URLs using minecraft_head
      const skinAndCape = await mc.getSkin(player);

      const embed = new EmbedBuilder()
        .setColor(0x31d533)
        .setTitle("Minecraft Utilities")
        .setURL("https://spectex.xyz/")
        .setDescription("**Here is the requested player profile**")
        .addFields(
          { name: "**Player Name**", value: `\`\`\`${playerName}\`\`\`` },
          { name: "**UUID**", value: `\`\`\`${uuid}\`\`\`` },
          {
            name: "**Textures**",
            value: `\n[View Skin](${skinAndCape.skin})\n[View Cape](${skinAndCape.cape})`,
          }
        )
        .setThumbnail(bodyImageUrl) // Set the body image as the thumbnail
        .setFooter({ text: 'Minecraft Utilities' });

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
        embeds: [embed],
      });
    } catch (error) {
      console.error("[ERROR] An error occurred:", error);
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
                name: "Error Details",
                value: `\`\`\`${error}\`\`\``,
              },
            ],
          },
        ],
      });
    }
  },
};
