const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const mc = require("minecraft_head");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hyprofile")
    .setDescription("Get Hypixel player profile")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Hypixel player username")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const username = interaction.options.getString("username");
    const apiKey = process.env.HYPIXEL_API; // Replace with your Hypixel API key

    try {
      const response = await axios.get(
        `https://api.hypixel.net/player?key=${apiKey}&name=${username}`
      );

      const uuidData = await mc.nameToUuid(username);

      if (!uuidData || !uuidData.uuid) {
        throw new Error("UUID not found");
      }

      const uuid = uuidData.uuid;

      // Fetch full body image
      const bodyImageUrl = `https://api.mineatar.io/body/full/${uuid}`;
      console.log('[UUID]:', uuid); // Debug: Log the UUID
      console.log('[Username]:', username); // Debug: Log the UUID
      console.log('bodyImageUrl:', bodyImageUrl); // Debug: Log the image URL

      if (response.data.success) {
        const playerData = response.data.player;

        // Extract the relevant data from the API response
        const uuid = playerData.uuid;
        const displayName = playerData.displayname;
        const firstLogin = new Date(playerData.firstLogin).toLocaleString();
        const lastLogin = new Date(playerData.lastLogin).toLocaleString();
        const userLanguage = playerData.userLanguage;
        const skyblockProfiles = Object.values(
          playerData.stats.SkyBlock.profiles
        ).map((profile) => profile.cute_name);
        const achievementPoints = playerData.achievementPoints;
        const karma = playerData.karma;
        const socialMediaLinks = playerData.socialMedia.links;
        const hypixelLevel = playerData.leveling.claimedRewards.length;
        const rank = playerData.newPackageRank;
        const currentPet = playerData.currentPet;
        const mostRecentGameType = playerData.mostRecentGameType;
        // Extract other data you need here

        // Create an embed to display the player's profile
        const embed = new EmbedBuilder()
          .setColor(0xFFEA4E)
          .setTitle("Minecraft Utilities")
          .setURL("https://spectex.xyz/")
          .setThumbnail(bodyImageUrl) // Set the body image as the thumbnail
          .setDescription(
            `**Here is the requested Hypixel player profile**\n\n**Username:** \`${displayName}\`\n**UUID:** \`${uuid}\``
          )
          .addFields(
            {
              name: "**First Login**",
              value: `\`\`\`${firstLogin}\`\`\``,
            },
            {
              name: "**Last Login**",
              value: `\`\`\`${lastLogin}\`\`\``,
            },
            {
              name: "**Language**",
              value: `\`\`\`${userLanguage}\`\`\``,
            },
            {
              name: "**Skyblock Profiles**",
              value: `\`\`\`${skyblockProfiles.join(", ")}\`\`\``,
            },
            {
              name: "**Achievement Points**",
              value: `\`\`\`${achievementPoints}\`\`\``,
            },
            {
              name: "**Karma**",
              value: `\`\`\`${karma}\`\`\``,
            },
            {
              name: "**Social Media**",
              value: `\`\`\`${formatSocialMediaLinks(socialMediaLinks)}\`\`\``,
            },
            {
              name: "**Hypixel Level**",
              value: `\`\`\`${hypixelLevel}\`\`\``,
            },
            {
              name: "**Rank**",
              value: `\`\`\`${rank}\`\`\``,
            },
            {
              name: "**Current Pet**",
              value: `\`\`\`${currentPet}\`\`\``,
            },
            {
              name: "**Most Recent Game Type**",
              value: `\`\`\`${mostRecentGameType}\`\`\``,
            }
          )
          .setThumbnail(
            `https://crafatar.com/renders/body/${uuid}?overlay=true`
          )
          .setFooter({ text: "Hypixel Player Profile" });

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
      } else {
        interaction.editReply("Player not found.");
      }
    } catch (error) {
      console.error(error);
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
function formatSocialMediaLinks(links) {
  let formattedLinks = "";
  for (const platform in links) {
    formattedLinks += `[${platform}](${links[platform]})\n`;
  }
  return formattedLinks;
}
