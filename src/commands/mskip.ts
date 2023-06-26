import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from "discord.js";

export default {
  "data": new SlashCommandBuilder()
    .setName("mskip")
    .setDescription("Skips the current song."),
  "execute": async (interaction: ChatInputCommandInteraction) => {
    if (!(interaction.member as GuildMember).voice.channel) {
      await interaction.reply("You must be in a voice channel to use this command.");
      return;
    }

    if (!interaction.client.player.queues.has(interaction.guild)) {
      await interaction.reply("There is currently no queue available.");
      return;
    }

    const queue = interaction.client.player.queues.get(interaction.guild);
    queue.node.skip();

    await interaction.reply("👍");
  }
}