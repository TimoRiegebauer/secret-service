import dotenv from "dotenv";
dotenv.config();

import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Player } from "discord-player";
import path from "node:path";
import fs from "node:fs";

declare module "discord.js" {
  interface Client {
    commands: Collection<any, any>;
    selectMenus: Collection<any, any>;
    player: Player;
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25
  }
});

client.player.extractors.loadDefault();

client.commands = new Collection();
(async () => {
  const commandsPath = path.join(__dirname, "commands");
  const commandsFolder = fs.readdirSync(commandsPath);

  for (const file of commandsFolder) {
    const filePath = path.join(commandsPath, file);
    const command = (await import(filePath)).default;

    if (command.data !== undefined && command.execute !== undefined) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
})();

(async () => {
  const eventsPath = path.join(__dirname, "events");
  const eventsFolder = fs.readdirSync(eventsPath);

  for (const file of eventsFolder) {
    const filePath = path.join(eventsPath, file);
    const event = (await import(filePath)).default;

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
})();

client.selectMenus = new Collection();

(async () => {
  const selectMenusPath = path.join(__dirname, "components", "select_menus");
  const selectMenusFolder = fs.readdirSync(selectMenusPath);

  for (const file of selectMenusFolder) {
    const filePath = path.join(selectMenusPath, file);
    const selectMenu = (await import(filePath)).default;

    if (selectMenu.data !== undefined) {
      client.selectMenus.set(selectMenu.data.name, selectMenu);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" property.`);
    }
  }
})();

client.login(process.env.BOT_TOKEN);