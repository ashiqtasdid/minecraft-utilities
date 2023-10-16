const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const mc = require("minecraft_head");
const { EmbedBuilder } = require("discord.js");
const { getNetworth } = require("skyhelper-networth");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hyskyblock")
    .setDescription("Get Hypixel Skyblock player profile")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Hypixel player username")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const username = interaction.options.getString("username");
      const uuidData = await mc.nameToUuid(username);

      if (!uuidData || !uuidData.uuid) {
        return interaction.editReply("UUID not found.");
      }

      const uuid = uuidData.uuid;
      const hypixelApiKey = process.env.HYPIXEL_API;

      console.log("[UUID] [Skyblock]:", uuid); // Debug: Log the UUID

      if (!hypixelApiKey) {
        return interaction.editReply("Hypixel API key is missing.");
      }

      // Fetch SkyBlock profiles
      const profilesResponse = await axios.get(
        `https://api.hypixel.net/skyblock/profiles?key=${hypixelApiKey}&uuid=${uuid}`
      );

      if (!profilesResponse.data.success || !profilesResponse.data.profiles) {
        return interaction.editReply("No SkyBlock profiles found for this player.");
      }

      const profiles = profilesResponse.data.profiles;
      const embeds = [];

      for (const profile of profiles) {
        const museumData = await axios.get(
          `https://api.hypixel.net/skyblock/museum?key=${hypixelApiKey}&profile=${profile.profile_id}`
        );

        const profileData = profile.members[uuid];
        const bankBalance = profile.banking?.balance;
        const networth = await getNetworth(profileData, bankBalance, { museumData });

        console.log(
          "[BANK: ]" +
            networth.bank +
            ". NETWORTH: " +
            networth.networth +
            ". PURSE: " +
            networth.purse
        );

        const embed = new EmbedBuilder()
          .setTitle(`**Profile: ${profile.cute_name}**`)
          .setColor(0x2DD21A) 
          .addFields({
            name: "**Info**",
            value: `
                **Selected:** \`${profile.selected ? "Yes" : "No"}\`
                **Profile ID:** \`${profile.profile_id}\`
                **Members:** \`${Object.keys(profile.members).length}\`
                **Pets:** \`${profile.members[uuid].pets.length}\`
                **Pet List:** \`${(profile.members[uuid].pets.map((pet) => pet.type).join(", ")) || 'None'}\`
                **Deaths:** \`${profile.members[uuid].stats.deaths || 'not found' }\`
                **Highest Crit Damage:** \`${profile.members[uuid].stats.highest_critical_damage || 'not found'}\`
                **Fairy Souls:** \`${profile.members[uuid].fairy_souls_collected}\`
                **Purse:** \`${profile.members[uuid].coin_purse || '0'}\`
                **Bank Balance:** \`${profile.banking?.balance || '0'}\`
                **Networth:** \`${networth.networth || '0'}\`
                **Auctions Highest Bid:** \`${profile.members[uuid].stats.auctions_highest_bid || 'not found'}\`
                `
          });

        embeds.push(embed);
      }

      // Send multiple embeds as a response
      await interaction.editReply({ embeds });
    } catch (error) {
      console.error(error);
      await interaction.editReply("An error occurred while processing the request.");
    }
  },
};
