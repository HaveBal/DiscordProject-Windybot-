const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const welcomeChannelSchema = require("../../schemas/WelcomeChannel");

const data = new SlashCommandBuilder()
  .setName("setup-welcome-channel")
  .setDescription("Setup a channel to send welcome messages too. MODERATOR ONLY")
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addChannelOption((option) =>
    option
      .setName("target-channel")
      .setDescription("The channel to get welcome messages in")
      .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("custom-message")
      .setDescription("TEMPLATE: {mention-member} {username} {server-name}")
  );

/**
 *
 * @param {import('commandkit').SlashCommandProps} param0
 */

async function run({ interaction }) {
  try {
    const targetChannel = interaction.options.getChannel("target-channel");
    const customMessage = interaction.options.getString("custom-message");

    await interaction.deferReply({ ephemeral: true });

    const query = {
      guildId: interaction.guildId,
      channelId: targetChannel.id,
    };

    const channelExistsInDB = await welcomeChannelSchema.exists(query);

    if (channelExistsInDB) {
      interaction.followUp(
        "this channel has already be configured for welcome messages"
      );
      return;
    }

    const newWelcomeChannel = new welcomeChannelSchema({
      ...query,
      customMessage,
    });

    newWelcomeChannel
      .save()
      .then(() => {
        interaction.followUp(
          `Configured ${targetChannel} to recieve welcome messages`
        );
      })
      .catch((error) => {
        interaction.followUp("Database error, please try again in a moment");
        console.log(`DB error in ${__filename}:\n, error`);
        return;
      });
  } catch (error) {
    console.log(`Error in ${__filename}:\n ${error}`);
  }
}

module.exports = { data, run, options: { devOnly: true } };
