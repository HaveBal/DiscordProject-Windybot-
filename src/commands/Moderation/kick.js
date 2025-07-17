const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const BotLogger = require('../../utils/logModeration.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a member from this server. MODERATOR ONLY')
    .addUserOption(option =>
      option
        .setName('target-user')
        .setDescription('The user you want to kick.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for the kick.')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   * @param {import('discord.js').Client} client
   */
  run: async ({ interaction }) => {
    const targetUser = interaction.options.getUser('target-user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    await interaction.deferReply();

    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!targetMember) {
      return interaction.editReply("🚫 That user doesn't exist in this server.");
    }

    if (targetMember.id === interaction.guild.ownerId) {
      return interaction.editReply("🚫 You can't kick the server owner.");
    }

    const targetRolePos = targetMember.roles.highest.position;
    const requestRolePos = interaction.member.roles.highest.position;
    const botRolePos = interaction.guild.members.me.roles.highest.position;

    if (targetRolePos >= requestRolePos) {
      return interaction.editReply("🚫 You can't kick someone with an equal or higher role.");
    }

    if (targetRolePos >= botRolePos) {
      return interaction.editReply("🚫 I can't kick someone with an equal or higher role than me.");
    }

    try {
      await targetMember.kick({ reason });
      await interaction.editReply(`✅ ${targetUser.tag} was kicked.\n**Reason:** ${reason}`);
    } catch (error) {
      console.error(`❌ Error kicking user: ${error}`);
      await interaction.editReply('❌ Something went wrong while trying to kick the user.');
    }

    await BotLogger(interaction.guild, 'Kick', targetUser, interaction.user, reason);
  },

  options: {
    devOnly: true,
  },
};
