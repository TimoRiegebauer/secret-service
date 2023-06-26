import { QueueFilters } from "discord-player";
import { AnySelectMenuInteraction, GuildMember } from "discord.js";

export default {
  "data": {
    "name": "filter_menu"
  },
  "execute": async (interaction: AnySelectMenuInteraction) => {
    if (!(interaction.member as GuildMember).voice.channel) {
      await interaction.reply("You must be in a voice channel to use this command.");
      return;
    }

    if (!interaction.client.player.queues.has(interaction.guild)) {
      await interaction.reply("There is currently no queue available.");
      return;
    }

    const queue = interaction.client.player.queues.get(interaction.guild);

    if (interaction.values[0] === "clean") {
      queue.filters.ffmpeg.toggle([...queue.filters.ffmpeg.getFiltersEnabled()]);
    } else {
      queue.filters.ffmpeg.toggle([...queue.filters.ffmpeg.getFiltersEnabled(), interaction.values[0] as keyof QueueFilters]);
    }

    await interaction.deferUpdate();
  }
}