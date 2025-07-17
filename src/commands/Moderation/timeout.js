const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const BotLogger = require('../../utils/logModeration.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user for a set duration. MODERATOR ONLY")
    .addUserOption((option) =>
      option
        .setName("target-user")
        .setDescription("The user you want to timeout.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration in minutes (max 10080 = 7 days).")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the warning.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   * @param {import('discord.js').Client} client
   */
  run: async ({ interaction, client }) => {
    const targetUser = interaction.options.getUser("target-user");
    const durationMinutes = interaction.options.getInteger("duration");
    const reason = interaction.options.getString("reason") || "No reason provided";

    const targetMember = await interaction.guild.members
      .fetch(targetUser.id)
      .catch(() => null);

    if (!targetMember) {
      return interaction.reply({
        content: "❌ User is not in this server",
        ephemeral: true,
      });
    }

    if (!targetMember.moderatable) {
      return interaction.reply({
        content: '❌ I cannot timeout this user. They may have higher permissions',
        ephemeral: true,
      });
    }

    const durationMs = durationMinutes * 60 * 1000;

    try {
      await targetMember.timeout(durationMs, reason);
      await interaction.reply({
        content: `⏳ ${targetMember.tag} has been timed out for **${durationMinutes} minutes**.\n**Reason:** ${reason}`,
      });
    } catch (error) {
      console.log(`Timeout error: ${error}`);
      await interaction.reply({
        content: '❌ Failed to timeout the user.',
        ephemeral: true,
      });
    }

    await BotLogger(interaction.guild, 'Timeout', targetUser, interaction.user, reason, '30m');
  },

  options: {
    devOnly: true,
  },
};
