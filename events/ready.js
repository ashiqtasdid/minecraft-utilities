const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    client.user.setActivity('Minecraft', { type: ActivityType.Playing });

    console.log(`Ready! Logged in as ${client.user.tag} & Serving ${client.guilds.cache.size} Servers`);
  },
};
