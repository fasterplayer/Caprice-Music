import Discord, { Interaction, GuildMember, Snowflake, Guild, ClientOptions } from 'discord.js';
import {
	AudioPlayerStatus,
	AudioResource,
	DiscordGatewayAdapterCreator,
	entersState,
	joinVoiceChannel,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { playRadio, Track } from './music/track';
import { MusicSubscription } from './music/subscription';
import { addedToQueue, cantJoinVc, currentlyPlaying, errored, finishedPlaying, leave, leftChannel, musicLinkError, noRadioFeedFound, notInVcError, notPlaying, pause, paused, playingRadioStation, playSong, queue, radio, radioCommandOption, radioInfoSubCommandName, radioListSubCommandName, radioStationSubCommandName, resume, skip, songLink, songSkipped, stationInfo, unpaused } from './imports/messages';
import settings from './imports/settings';
import { errorsHandler, sendError, sendInterval } from './imports/error-handler';
import { getGuildPrefix, guildCache } from './imports/helpers';
import { radioApplicationCommandData } from './imports/application-command';
import { getFeed, radioList } from './imports/radiolist';

export const client: Discord.Client<boolean> = new Discord.Client({
	intents: [
		'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS','DIRECT_MESSAGE_TYPING', 'GUILDS', 'GUILD_BANS',
		'GUILD_INTEGRATIONS', 'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING',
		'GUILD_PRESENCES', 'GUILD_VOICE_STATES', 'GUILD_WEBHOOKS'
	]
});


client.on('ready', () => {

	sendInterval(client)
	errorsHandler(client)

    sendError(`Startup`, client.user, {name: `Startup`, stack: `Le bot est en ligne avec ${client.users.cache.size} utilisateurs, ${client.channels.cache.size} channels de ${client.guilds.cache.size} serveurs.`, message: `Login sucessfull`})
    console.log(`Le bot est en ligne avec ${client.users.cache.size} utilisateurs, ${client.channels.cache.size} channels de ${client.guilds.cache.size} serveurs.`)

    client.guilds.cache.forEach(async (guild: Guild) => {
        if (!guild.ownerId) return console.log(`Je n'ai pas accès aux membres. Veuillez suivre ce tutoriel : https://caprice.fasterplayer.ca/?p=263`)

        await guildCache(guild, client)
    })

})


async function deploy(guild: Guild) {
	const commands = await guild.commands.fetch()

	const playCommand = commands.find(command => command.name === 'play' && command.client.user?.id === client.user?.id)
	if (playCommand && playCommand.description !== playSong(guild.id)) {
		playCommand.edit({
			name: 'play',
			description: playSong(guild.id),
			options: [
				{
					name: 'song',
					type: 'STRING' as const,
					description: songLink(guild.id),
					required: true,
				},
			],
		})
	}
	else {
		guild.commands.create({
			name: 'play',
			description: playSong(guild.id),
			options: [
				{
					name: 'song',
					type: 'STRING' as const,
					description: songLink(guild.id),
					required: true,
				},
			],
		})
	}

	const skipCommand = commands.find(command => command.name === 'skip' && command.client.user?.id === client.user?.id)

	if (skipCommand && skipCommand.description !== skip(guild.id)) {
		skipCommand.edit({
			name: 'skip',
			description: skip(guild.id),
		})
	}
	else {
		guild.commands.create({
			name: 'skip',
			description: skip(guild.id),

		})
	}

	const pauseCommand = commands.find(command => command.name === 'pause' && command.client.user?.id === client.user?.id)

	if (pauseCommand && pauseCommand.description !== pause(guild.id)) {
		pauseCommand.edit({
			name: 'pause',
			description: pause(guild.id),
		})
	}
	else {
		guild.commands.create({
			name: 'pause',
			description: pause(guild.id),

		})
	}

	const queueCommand = commands.find(command => command.name === 'queue' && command.client.user?.id === client.user?.id)

	if (queueCommand && queueCommand.description !== queue(guild.id)) {
		queueCommand.edit({
			name: 'queue',
			description: queue(guild.id),
		})
	}
	else {
		guild.commands.create({
			name: 'queue',
			description: queue(guild.id),
		})
	}

	const resumeCommand = commands.find(command => command.name === 'resume' && command.client.user?.id === client.user?.id)

	if (resumeCommand && resumeCommand.description !== resume(guild.id)) {
		resumeCommand.edit({
			name: 'resume',
			description: resume(guild.id),
		})
	}
	else {
		guild.commands.create({
			name: 'resume',
			description: resume(guild.id),
		})
	}

	const leaveCommand = commands.find(command => command.name === 'leave' && command.client.user?.id === client.user?.id)

	if (leaveCommand && leaveCommand.description !== leave(guild.id)) {
		leaveCommand.edit({
			name: 'leave',
			description: leave(guild.id),
		})
	}
	else {
		guild.commands.create({
			name: 'leave',
			description: leave(guild.id),
		})
	}

	const radioCommand = commands.find(command => command.name === 'radio' && command.client.user?.id === client.user?.id)

	if (radioCommand && radioCommand.description) {
		radioCommand.edit(radioApplicationCommandData(guild.id))
	}
	else {
		guild.commands.create(radioApplicationCommandData(guild.id))
	}
}


// This contains the setup code for creating slash commands in a guild. The owner of the bot can send "!deploy" to create them.
client.on('messageCreate', async (message) => {
	if (!message.guild) return;
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!deploy') {
		deploy(message.guild)
	}

	if (message.content.toLowerCase() === '!test') {
	}
});

/**
 * Maps guild IDs to music subscriptions, which exist if the bot has an active VoiceConnection to the guild.
 */
const subscriptions = new Map<Snowflake, MusicSubscription>();

// Handles slash command interactions
client.on('interactionCreate', async (interaction: Interaction) => {
	const guild = interaction.guild
	if (!(guild instanceof Guild)) return

	const member = interaction.member
	if (!(member instanceof GuildMember)) return

	if (!interaction.isCommand() || !guild.id) return;
	let subscription = subscriptions.get(guild.id);

	if (interaction.commandName === 'play') {
		await interaction.defer();
		// Extract the video URL from the command
		const url = interaction.options.get('song')!.value! as string;
		const ytbLink: boolean = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/.test(url)

		if (!ytbLink) {
			await interaction.followUp(musicLinkError(guild.id));
			return;
		}

		// If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
		// and create a subscription.
		if (!subscription) {
			if (interaction.member instanceof GuildMember && interaction.member.voice.channel) {
				const channel = interaction.member.voice.channel;
				subscription = new MusicSubscription(
					joinVoiceChannel({
						channelId: channel.id,
						guildId: channel.guild.id,
						adapterCreator: channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
					}),
				);
				subscription.voiceConnection.on('error', console.warn);
				subscriptions.set(guild.id, subscription);
			}
		}

		// If there is no subscription, tell the user they need to join a channel.
		if (!subscription) {
			await interaction.followUp(notInVcError(guild.id));
			return;
		}

		// Make sure the connection is ready before processing the user's request
		try {
			await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
		} catch (error) {
			console.warn(error);
			await interaction.followUp(cantJoinVc(guild.id));
			return;
		}

		try {
			// Attempt to create a Track from the user's video URL
			const track = await Track.from(url, {
				onStart() {
					interaction.followUp({ content: currentlyPlaying(guild.id as Snowflake), ephemeral: true }).catch(console.warn);
				},
				onFinish() {
					interaction.followUp({ content: finishedPlaying(guild.id as Snowflake), ephemeral: true }).catch(console.warn);
				},
				onError(error) {
					console.warn(error);
					interaction.followUp({ content: errored(guild.id as Snowflake), ephemeral: true }).catch(console.warn);
				},
			});
			// Enqueue the track and reply a success message to the user
			subscription.enqueue(track);
			await interaction.followUp(addedToQueue(guild.id, track.title));
		} catch (error) {
			console.warn(error);
			await interaction.followUp(errored(guild.id));
		}
	} else if (interaction.commandName === 'skip') {
		if (subscription) {
			// Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
			// listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
			// will be loaded and played.
			subscription.audioPlayer.stop();
			await interaction.reply(songSkipped(guild.id));
		} else {
			await interaction.reply(notPlaying(guild.id));
		}
	} else if (interaction.commandName === 'queue') {
		// Print out the current queue, including up to the next 5 tracks to be played.
		if (subscription) {
			const current =
				subscription.audioPlayer.state.status === AudioPlayerStatus.Idle
					? `Nothing is currently playing!`
					: `Playing **${(subscription.audioPlayer.state.resource as AudioResource<Track>).metadata.title}**`;

			const queue = subscription.queue
				.slice(0, 5)
				.map((track, index) => `${index + 1}) ${track.title}`)
				.join('\n');

			await interaction.reply(`${current}\n\n${queue}`);
		} else {
			await interaction.reply(notPlaying(guild.id));
		}
	} else if (interaction.commandName === 'pause') {
		if (subscription) {
			subscription.audioPlayer.pause();
			await interaction.reply({ content: paused(guild.id), ephemeral: true });
		} else {
			await interaction.reply(notPlaying(guild.id));
		}
	} else if (interaction.commandName === 'resume') {
		if (subscription) {
			subscription.audioPlayer.unpause();
			await interaction.reply({ content: unpaused(guild.id), ephemeral: true });
		} else {
			await interaction.reply(notPlaying(guild.id));
		}
	} else if (interaction.commandName === 'leave') {
		if (subscription) {
			subscription.voiceConnection.destroy();
			subscriptions.delete(guild.id);
			await interaction.reply({ content: leftChannel(guild.id), ephemeral: true });
		} else {
			await interaction.reply(notPlaying(guild.id));
		}
	} 
	else if (interaction.commandName === 'radio') {
		await interaction.defer();
		const subCommand = interaction.options.getSubCommand()
		const option = interaction.options.data[0].options

		if (subCommand === radioStationSubCommandName(guild.id)) {
			if (option) {
				const stationID = Number(option[0].value)
				const feed = getFeed(stationID)

				if (feed) {
					if (subscription) {
						try {
							await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
							playRadio(feed, subscription.voiceConnection)
							subscriptions.delete(guild.id)
							await interaction.followUp(playingRadioStation(guild.id, feed.name));
						} catch (error) {
							console.warn(error);
							return;
						}
					}
					else {
						if (member.voice.channel) {
							const channel = member.voice.channel;
							subscription = new MusicSubscription(
								joinVoiceChannel({
									channelId: channel.id,
									guildId: channel.guild.id,
									adapterCreator: channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
								}),
							);
							subscription.voiceConnection.on('error', console.warn);
							subscriptions.set(guild.id, subscription);
						}

						if (!subscription) {
							await interaction.followUp(notInVcError(guild.id));
							return;
						}
						try {
							await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
							playRadio(feed, subscription.voiceConnection)
							await interaction.followUp(playingRadioStation(guild.id, feed.name));
						} catch (error) {
							console.warn(error);
							await interaction.followUp(cantJoinVc(guild.id));
							return;
						}
					}
				}
				else {
					interaction.followUp({content: noRadioFeedFound(guild.id, stationID)})
				}
			}
		}
		else if (subCommand === radioInfoSubCommandName(guild.id)) {
			if (option) {
				const stationID = Number(option[0].value)
				const feed = getFeed(stationID)

				if (feed) {
					interaction.followUp({embeds: [stationInfo(member, guild.id, feed)]})
				}
				else {
					interaction.followUp({content: noRadioFeedFound(guild.id, stationID)})
				}
			}
		}
	} 
});

client.on('error', console.warn);

void client.login(settings.token);