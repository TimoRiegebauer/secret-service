require("dotenv").config();

const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const  path = require("node:path");

const commands = [];

const commandsPath = path.join(__dirname, "build", "commands");
const commandsFolder = fs.readdirSync(commandsPath);

for (const file of commandsFolder) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath).default;

  if (command.data !== undefined && command.execute !== undefined) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.BOT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.log(error);
  }
})();