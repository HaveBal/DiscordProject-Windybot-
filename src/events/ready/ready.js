/** * @param {import('discord.js').Client} client */
module.exports = (client) => {
    console.log(`${client.user.displayName} is online!`);
}

const { ActivityType } = require("discord.js");

module.exports = (client) => {
  console.log(`${client.user.username} is online!`);

  const activities = [
    "Windy is being Developed!",
    "I'm in your walls owo",
    "Hai im Windy!",
  ];

  let index = 0; // <-- You need this line

  setInterval(() => {
    const status = activities[index];
    client.user.setPresence({
      activities: [{ name: status, type: ActivityType.Custom }],
    });
    index = (index + 1) % activities.length;
  }, 3000);
};
