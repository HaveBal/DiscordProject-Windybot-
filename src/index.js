require("dotenv/config");
const mongoose = require("mongoose");
const { Client, IntentsBitField } = require("discord.js");
const { CommandKit } = require("commandkit");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildModeration,
  ],
});

new CommandKit({
  client,
  devGuildIds: ["1019619653548519444", "1333100078055030864"],
  devUserIds: ["443924830769643520"],
  devRoleIds: ["1366823753979265097", "1366823896027762688"],
  eventsPath: `${__dirname}/events`,
  commandsPath: `${__dirname}/commands`,
  // validationsPath: `${__dirname}/validations`,
  bulkRegister: true,
  // skipBuiltInValidations: true,
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to database");

  client.login(process.env.TOKEN);
});
