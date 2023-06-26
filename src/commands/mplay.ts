import { QueryType } from "discord-player";
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandStringOption, ChatInputCommandInteraction, GuildMember } from "discord.js";

export default {
  "data": new SlashCommandBuilder()
    .setName("mplay")
    .setDescription("Adds a song to the queue.")
    .addSubcommand((subCommand: SlashCommandSubcommandBuilder) =>
      subCommand
        .setName("song")
        .setDescription("Plays a song from youtube.")
        .addStringOption((option: SlashCommandStringOption) =>
          option
            .setName("searchterms")
            .setDescription("Search Keywords")
            .setRequired(true)
        )
    ),
  "execute": async (interaction: ChatInputCommandInteraction) => {
    if (!(interaction.member as GuildMember).voice.channel) {
      await interaction.reply("You must be in a voice channel to use this command.");
      return;
    }

    let queue;

    if (!interaction.client.player.queues.has(interaction.guild)) {
      queue = interaction.client.player.queues.create(interaction.guild);
    } else {
      queue = interaction.client.player.queues.get(interaction.guild);
    }

    if (!queue.connection) {
      await queue.connect((interaction.member as GuildMember).voice.channel);
    }

    if (interaction.options.getSubcommand() === "song") {
      let searchTerms = interaction.options.getString("searchterms");

      const result = await interaction.client.player.search(searchTerms, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_SEARCH
      });

      if (result.tracks.length === 0) {
        await interaction.reply("No results found");
        return;
      }

      const song = result.tracks[0];

      if (!queue.isPlaying()) {
        queue.setMetadata({
          "channel": interaction.channel
        });
        queue.play(song);
      } else {
        queue.addTrack(song);
      }

      await interaction.reply(`Added **${song.title}** to the queue.`);
    }
  }
}