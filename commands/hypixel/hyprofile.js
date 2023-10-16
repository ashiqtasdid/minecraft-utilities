const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const mc = require("minecraft_head");

const playerProfileCache = {};

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
    const apiKey = process.env.HYPIXEL_API;

    if (
      playerProfileCache[username] &&
      playerProfileCache[username].timestamp > Date.now() - 120000
    ) {
      const cachedData = playerProfileCache[username].data;
      interaction.editReply(cachedData);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.hypixel.net/player?key=${apiKey}&name=${username}`
      );

      const uuidData = await mc.nameToUuid(username);
      const uuid = uuidData.uuid;
      const onlineStatus = await axios.get(
        `https://api.hypixel.net/status?key=${apiKey}&uuid=${uuid}`
      );

      if (!uuidData || !uuidData.uuid) {
        throw new Error("UUID not found");
      }

      // Fetch full body image
      const bodyImageUrl = `https://api.mineatar.io/body/full/${uuid}`;
      console.log("[UUID]:", uuid); // Debug: Log the UUID
      console.log("[Username]:", username); // Debug: Log the UUID
      console.log("bodyImageUrl:", bodyImageUrl); // Debug: Log the image URL

      if (response.data.success) {
        const playerData = response.data.player;
        const onlineStatusData = onlineStatus.data.session.online;
        // Extract the relevant data from the API response
        const uuid = playerData.uuid;
        const displayName = playerData.displayname;
        const achievementUnlocked = playerData.achievementsOneTime.length;
        const firstLogin = new Date(playerData.firstLogin).toLocaleString();
        const lastLogin =
          new Date(playerData.lastLogin).toLocaleString() || "Not found";
        const userLanguage = playerData.userLanguage || "Default [English]";
        const skyblockProfiles =
          Object.values(playerData.stats.SkyBlock.profiles).map(
            (profile) => profile.cute_name
          ) || "None";
        const achievementPoints = playerData.achievementPoints;
        const karma = playerData.karma;
        const socialMediaLinks = playerData.socialMedia?.links || "None";
        // const hypixelLevel = playerData.leveling.claimedRewards.length;
        let rank = playerData.newPackageRank || "Default";
        let currentPet = playerData.currentPet || "None";
        const mostRecentGameType = playerData.mostRecentGameType || "Not found";
        const online = onlineStatusData;
        const lastLogout =
          new Date(playerData.lastLogout).toLocaleString() || "Not found";

        // Skywars [Stats]
        const souls = playerData.stats.SkyWars.souls || "Not found";
        const coins = playerData.stats.SkyWars.coins || "Not found";
        const kills = playerData.stats.SkyWars.kills || "Not found";
        const deaths = playerData.stats.SkyWars.deaths || "Not found";
        const wins = playerData.stats.SkyWars.wins || "Not found";
        const losses = playerData.stats.SkyWars.losses || "Not found";
        const gamesPlayed =
          playerData.stats.SkyWars.games_played_skywars || "Not found";
        const level = playerData.stats.SkyWars.levelFormatted || "Not found";
        const winStreak = playerData.stats.SkyWars.win_streak || "0";

        // Bedwars [Stats]
        const bedwarsLevel =
          playerData.achievements.bedwars_level || "Not found";
        const bedwarsCoins = playerData.stats.Bedwars.coins || "Not found";
        const bwgamesPlayed =
          playerData.stats.Bedwars.games_played_bedwars || "Not found";
        const bwdeath = playerData.stats.Bedwars.deaths_bedwars || "Not found";
        const bwkills = playerData.stats.Bedwars.kills_bedwars || "Not found";
        const bwlosses = playerData.stats.Bedwars.losses_bedwars || "Not found";
        const bwwins = playerData.stats.Bedwars.wins_bedwars || "Not found";
        const bwwinstreak = playerData.stats.Bedwars.winstreak || "0";

        if (rank !== "Default") {
          modifiedRank = rank.replace(/_/g, " ");
          rank = modifiedRank.charAt(0).toUpperCase() + modifiedRank.slice(1);
        }
        if (currentPet !== "None") {
          modifiedPet = currentPet.replace(/_/g, " ");
          currentPet =
            modifiedPet.charAt(0).toUpperCase() + modifiedPet.slice(1);
        }

        // Create an embed to display the player's profile
        const embed = new EmbedBuilder()
          .setColor(0xffea4e)
          .setTitle("Minecraft Utilities")
          .setURL("https://spectex.xyz/")
          .setThumbnail(bodyImageUrl) // Set the body image as the thumbnail
          .setDescription(
            `**Here is the requested Hypixel player profile**\n\n**Username:** \`${displayName}\`\n**UUID:** \`${uuid}\``
          )
          .addFields(
            {
              name: "**Info**",
              value: `
              Online: \`${online}\`
              Rank: \`${rank}\`
              Karma: \`${karma}\`
              Achievement Unlocked: \`${achievementUnlocked}\`
              Language: \`${userLanguage}\`
              Recent Game Type: \`${mostRecentGameType}\`
              Social Media: \`${formatSocialMediaLinks(socialMediaLinks)}\`
              `,
            },
            {
              name: "**Stats**",
              value: `
              **Skywars**
              Souls: \`${souls}\`
              Level: \`${level}\`
              Games Played: \`${gamesPlayed}\`
              Coins: \`${coins}\`
              Kills: \`${kills}\`
              Deaths: \`${deaths}\`
              Wins: \`${wins}\`
              Losses: \`${losses}\`
              Win Streak: \`${winStreak}\`
              `,
              inline: true,
            },
            {
              name: "**Bedwars**",
              value: `
              Level: \`${bedwarsLevel}\`
              Games Played: \`${bwgamesPlayed}\`
              Coins: \`${bedwarsCoins}\`
              Kills: \`${bwkills}\`
              Deaths: \`${bwdeath}\`
              Wins: \`${bwwins}\`
              Losses: \`${bwlosses}\`
              Win Streak: \`${bwwinstreak}\`
              `,
              inline: true,
            },
            {
              name: "**Skyblock**",
              value: `
              Profiles: \`${skyblockProfiles}\`
              `,
              inline: true,
            },
            {
              name: "**Dates**",
              value: `
              First Login: \`${firstLogin}\`
              Last Login: \`${lastLogin}\`
              Last Logout: \`${lastLogout}\`
              `,
              inline: true,
            }
          )
          .setThumbnail(
            `https://crafatar.com/renders/body/${uuid}?overlay=true`
          )
          .setFooter({ text: "Hypixel Player Profile - Minecraft Utilities" });
        // Cache the data for 2 minutes
        playerProfileCache[username] = {
          timestamp: Date.now(),
          data: {
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
          },
        };

        interaction.editReply(playerProfileCache[username].data);
      } else {
        throw new Error("Player not found.");
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
                name: "**Possible Reasons**",
                value: `\`\`\`The player does not exist or the API is down\`\`\``,
              },
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
