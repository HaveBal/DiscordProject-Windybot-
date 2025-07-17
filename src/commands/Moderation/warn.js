const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const BotLogger = require('../../utils/logModeration.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('warn a member from this server. MODERATOR ONLY')
    .addUserOption(option =>
      option
        .setName('target-user')
        .setDescription('The user you want to warn.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('The reason for the warning.')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   * @param {import('discord.js').Client} client
   */
  run: async ({ interaction, client }) => {
    const targetUser = interaction.options.getUser('target-user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!targetMember) {
      return interaction.reply({
        content: '❌ User is not in this server',
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: `⚠️ ${targetUser} has been warned\n**Reason:** ${reason}`,
    });

    await BotLogger(interaction.guild, 'Warn', targetUser, interaction.user, reason);
  },

  options: {
    devOnly: true,
  },
};
