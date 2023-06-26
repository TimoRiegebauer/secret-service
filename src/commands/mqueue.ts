import { EmbedBuilder } from "@discordjs/builders";
import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from "discord.js";

export default {
  "data": new SlashCommandBuilder()
    .setName("mqueue")
    .setDescription("List all songs in the queue."),
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
    const queueString = queue.tracks.toArray().slice(0, 10).map((song, i) =>
      `${i + 1}) [${song.duration}] ${song.title} - ${song.requestedBy}`
    ).join("\n");

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`**Currently Playing:**\n${queue.currentTrack.title} - ${queue.currentTrack.requestedBy}\n\n**Queue:**\n${queueString}`)
          .setThumbnail(queue.currentTrack.thumbnail)
      ]
    })
  }
}