const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { Font } = require("canvacord");
const { GreetingsCard } = require("../../misc/welcome-card");
const welcomeChannelSchema = require("../../schemas/WelcomeChannel");

/**
 * @param {import('discord.js').GuildMember} guildMember
 */
module.exports = async (guildMember) => {
  try {
    if (guildMember.user.bot) return;

    const welcomeConfigs = await welcomeChannelSchema.find({
      guildId: guildMember.guild.id,
    });

    if (!welcomeConfigs.length) return;

    for (const welcomeConfig of welcomeConfigs) {
      const targetChannel =
        guildMember.guild.channels.cache.get(welcomeConfig.channelId) ||
        (await guildMember.guild.channels.fetch(welcomeConfig.channelId));

      if (!targetChannel) {
        welcomeChannelSchema
          .findOneAndDelete({
            guildId: guildMember.guild.id,
            channelId: welcomeConfig.channelId,
          })
          .catch(() => {});
      }
      /////////////////////

      Font.loadDefault();

      const card = new GreetingsCard()
        .setAvatar(guildMember.user.displayAvatarURL({ dynamic: true }))
        .setDisplayName(guildMember.displayName)
        .setType("welcome")
        .setMessage("Welcome to STAR.OS")
        .setBackground(
          "https://files.catbox.moe/rhb7sq.png"
        );

      const image = await card.build({ format: "png" });
      

      const embed = new EmbedBuilder()
        .setColor("#c0e4ff")
        .setTitle(`✦New User has entered STAR.OS!✦`)
        .setDescription(`Welcome User <@${guildMember.user.id}>, Please enjoy your stay <3`)
        .setImage('attachment://welcome.png')
        

      const attachment = new AttachmentBuilder(image, { name: "welcome.png"});
      targetChannel.send({ embeds: [embed], files: [attachment] }).catch(() => {});

    }
  } catch (error) {
    console.log(`Error in ${__filename}:\n ${error}`);
  }
};
