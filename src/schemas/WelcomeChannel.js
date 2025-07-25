const { Guild } = require("discord.js");
const { Schema, model } = require("mongoose");

const welcomeChannelSchema = new Schema(
  {
    guildId: {
      type: String,
      required: true,
    },
    channelId: {
      type: String,
      required: true,
    },
    customMessage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = model('WelcomeChannel', welcomeChannelSchema);