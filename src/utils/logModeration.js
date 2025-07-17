const { EmbedBuilder } = require("discord.js");

/**
 * @param {import('discord.js').Guild} guild
 * @param {string} action - Action type, e.g., "Warn", "Kick", "Ban", "Timeout"
 * @param {import('discord.js').User} targetUser
 * @param {import('discord.js').User} moderator
 * @param {string} reason
 */

async function logModerationAction(
  guild,
  action,
  targetUser,
  moderator,
  reason
) {
  const logChannel = guild.channels.cache.get('1377877837289099325');
  
  if (!logChannel) return;

  const colors = {
    Warn: "#ffcc00",
    Kick: "#ff944d",
    Ban: "#ff4d4d",
    Timeout: "#4da6ff",
  };

  const embed = new EmbedBuilder()
    .setTitle(`🔨 ${action} Issued`)
    .addFields(
      {
        name: "Target",
        value: `${targetUser.tag} (${targetUser.displayName})`,
        inline: false,
      },
      {
        name: "Moderator",
        value: `${moderator.tag} (${moderator.displayName})`,
        inline: false,
      },
      {
        name: "Reason",
        value: reason || "No reason provided",
        inline: false,
      },
      ...(action === "Timeout" && duration
        ? [{ name: "⏱ Duration", value: duration, inline: false }]
        : [])
    )
    .setColor(colors[action] || "#cccccc")
    .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
    .setTimestamp();

  logChannel.send({ embeds: [embed] });
}

module.exports = logModerationAction;
