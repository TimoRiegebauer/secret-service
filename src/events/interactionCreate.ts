import { Events, Interaction } from "discord.js";

export default {
  "name": Events.InteractionCreate,
  "once": false,
  "execute": async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
        } else {
          await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
      }
    } else if (interaction.isAnySelectMenu()) {
      const selectMenu = interaction.client.selectMenus.get(interaction.customId);

      try {
        await selectMenu.execute(interaction);
      } catch (error) {
        console.error(error);
      }
    }
  }
}