import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export default {
  "data": new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purges the first n messages in the channel.")
    .addNumberOption(option => 
      option
        .setName("messages")
        .setDescription("Number of messages to delete.")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),
  "execute": async (interaction: ChatInputCommandInteraction) => {
    if (interaction.user.id !== "682670750200889345") {
      await interaction.reply("You do not have the permissions to use this command!");
      return;
    }

    const nMessages = interaction.options.getNumber("messages");
    await interaction.channel.bulkDelete(nMessages, true);

    await interaction.reply("👍");
  }
}