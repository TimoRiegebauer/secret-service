import { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } from "@discordjs/builders";
import { Client, Events } from "discord.js";
import { setup } from "../utils/twitter";

export default {
  "name": Events.ClientReady,
  "once": true,
  "execute": (client: Client) => {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    client.player.events.on("playerStart", async (queue, track) => {
      const channel = (queue.metadata as any).channel;

      const filterMenu = new SelectMenuBuilder()
        .setCustomId("filter_menu")
        .setPlaceholder("Audio Filter")
        .setMaxValues(1)
        .setOptions(
          new SelectMenuOptionBuilder({ label: "Clean", value: "clean" }),
          new SelectMenuOptionBuilder({ label: "Bassboost", value: "bassboost" }),
          new SelectMenuOptionBuilder({ label: "Earrape", value: "earrape" }),
          new SelectMenuOptionBuilder({ label: "Nightcore", value: "nightcore" }),
          new SelectMenuOptionBuilder({ label: "Lofi", value: "lofi" }),
          new SelectMenuOptionBuilder({ label: "8D", value: "8D" }),
          new SelectMenuOptionBuilder({ label: "Vaporwave", value: "vaporwave" }),
          new SelectMenuOptionBuilder({ label: "Phaser", value: "phaser" }),
          new SelectMenuOptionBuilder({ label: "Tremolo", value: "tremolo" }),
          new SelectMenuOptionBuilder({ label: "Vibrato", value: "vibrato" }),
          new SelectMenuOptionBuilder({ label: "Reverse", value: "reverse" }),
          new SelectMenuOptionBuilder({ label: "Treble", value: "treble" }),
          new SelectMenuOptionBuilder({ label: "Normalizer", value: "normalizer" }),
          new SelectMenuOptionBuilder({ label: "Surrounding", value: "surrounding" }),
          new SelectMenuOptionBuilder({ label: "Pulsator", value: "pulsator" }),
          new SelectMenuOptionBuilder({ label: "Sub Boost", value: "subboost" }),
          new SelectMenuOptionBuilder({ label: "Karaoke", value: "karaoke" }),
          new SelectMenuOptionBuilder({ label: "Flanger", value: "flanger" }),
          new SelectMenuOptionBuilder({ label: "Mono", value: "mono" }),
          new SelectMenuOptionBuilder({ label: "Chorus", value: "chorus" }),
          new SelectMenuOptionBuilder({ label: "Fade In", value: "fadein" })
        );

      const embed = new EmbedBuilder()
        .setTitle(`Now playing: ${track.title}`)
        .setColor(0x48A14D)
        .setDescription(`Added by ${track.requestedBy}\n[Watch on YouTube](${track.url})`)
        .setThumbnail(track.thumbnail)
        .setFooter({ text: `Duration: ${track.duration}` });

      await channel.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(filterMenu)]
      });
    });

    client.player.events.on("disconnect", async (queue) => {
      const channel = (queue.metadata as any).channel;

      await channel.send("Finished the queue! Bye");
    });

    setup(client);
  }
}