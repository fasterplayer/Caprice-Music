import Discord, { Interaction, GuildMember, Snowflake, Guild } from 'discord.js';
import {
	DiscordGatewayAdapterCreator,
	entersState,
	joinVoiceChannel,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { playRadio, Track } from './music/track';
import { MusicSubscription } from './music/subscription';
import { addedToQueue, alreadyInUse, cantJoinVc, errored, leave, leftChannel, musicLinkError, noPauseRadio, noRadioFeedFound, noSkipRadio, notInVcError, notPlaying, pause, paused, playingRadioStation, playSong, queue, radioInfoSubCommandName, radioListSubCommandName, radioStationSubCommandName, resume, skip, songLink, songQueue, songSkipped, stationInfo, unpaused } from './imports/messages';
import settings from './imports/settings';
import { errorsHandler, sendError, sendInterval } from './imports/error-handler';
import { audioPossibleCommands, guildCache } from './imports/helpers';
import { pauseCommandData, playCommandData, queueCommandData, radioApplicationCommandData, resumeCommandData, skipCommandData, stopCommandData } from './imports/application-command';
import { getFeed, radioList } from './imports/radiolist';
import { Commands, Country } from './imports/class';

export const client: Discord.Client<boolean> = new Discord.Client({
	intents: [
		'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS','DIRECT_MESSAGE_TYPING', 'GUILDS', 'GUILD_BANS',
		'GUILD_INTEGRATIONS', 'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING',
		'GUILD_PRESENCES', 'GUILD_VOICE_STATES', 'GUILD_WEBHOOKS'
	]
});

client.setMaxListeners(0)

client.on('ready', () => {

	sendInterval(client)
	errorsHandler(client)

    sendError(`Startup`, client.user, {name: `Startup`, stack: `Le bot est en ligne avec ${client.users.cache.size} utilisateurs, ${client.channels.cache.size} channels de ${client.guilds.cache.size} serveurs.`, message: `Login successful`})
    console.log(`Le bot est en ligne avec ${client.users.cache.size} utilisateurs, ${client.channels.cache.size} channels de ${client.guilds.cache.size} serveurs.`)

    client.guilds.cache.forEach(async (guild: Guild) => {
        if (!guild.ownerId) return console.log(`Je n'ai pas accès aux membres. Veuillez suivre ce tutoriel : https://caprice.fasterplayer.ca/?p=263`)

        await guildCache(guild, client)
    })

})


async function localDeploy(guild: Guild) {
	const commands = await guild.commands.fetch()

	const playCommand = commands.find(command => command.name === Commands.Play)
	if (playCommand && playCommand.description !== playSong(guild.id)) {
		playCommand.edit(playCommandData(guild.id))
	}
	else {
		guild.commands.create(playCommandData(guild.id))
	}

	const skipCommand = commands.find(command => command.name === Commands.Skip)

	if (skipCommand && skipCommand.description !== skip(guild.id)) {
		skipCommand.edit(skipCommandData(guild.id))
	}
	else {
		guild.commands.create(skipCommandData(guild.id))
	}

	const pauseCommand = commands.find(command => command.name === Commands.Pause)

	if (pauseCommand && pauseCommand.description !== pause(guild.id)) {
		pauseCommand.edit(pauseCommandData(guild.id))
	}
	else {
		guild.commands.create(pauseCommandData(guild.id))
	}

	const queueCommand = commands.find(command => command.name === Commands.Queue)

	if (queueCommand && queueCommand.description !== queue(guild.id)) {
		queueCommand.edit(queueCommandData(guild.id))
	}
	else {
		guild.commands.create(queueCommandData(guild.id))
	}

	const resumeCommand = commands.find(command => command.name === Commands.Resume)

	if (resumeCommand && resumeCommand.description !== resume(guild.id)) {
		resumeCommand.edit(resumeCommandData(guild.id))
	}
	else {
		guild.commands.create(resumeCommandData(guild.id))
	}

	const leaveCommand = commands.find(command => command.name === Commands.Stop)

	if (leaveCommand && leaveCommand.description !== leave(guild.id)) {
		leaveCommand.edit(stopCommandData(guild.id))
	}
	else {
		guild.commands.create(stopCommandData(guild.id))
	}

	const radioCommand = commands.find(command => command.name === Commands.Radio)

	if (radioCommand && radioCommand.description) {
		radioCommand.edit(radioApplicationCommandData(guild.id))
	}
	else {
		guild.commands.create(radioApplicationCommandData(guild.id))
	}
}

async function globalDeploy() {
	if (!client.application) return false
	const commands = await client.application.commands.fetch()
	const applicationCommands = client.application.commands

	const playCommand = commands.find(command => command.name === Commands.Play)
	if (playCommand && playCommand.description !== playSong()) {
		playCommand.edit(playCommandData())
	}
	else {
		applicationCommands.create(playCommandData())
	}

	const skipCommand = commands.find(command => command.name === Commands.Skip)

	if (skipCommand && skipCommand.description !== skip()) {
		skipCommand.edit(skipCommandData())
	}
	else {
		applicationCommands.create(skipCommandData())
	}

	const pauseCommand = commands.find(command => command.name === Commands.Pause)

	if (pauseCommand && pauseCommand.description !== pause()) {
		pauseCommand.edit(pauseCommandData())
	}
	else {
		applicationCommands.create(pauseCommandData())
	}

	const queueCommand = commands.find(command => command.name === Commands.Queue)

	if (queueCommand && queueCommand.description !== queue()) {
		queueCommand.edit(queueCommandData())
	}
	else {
		applicationCommands.create(queueCommandData())
	}

	const resumeCommand = commands.find(command => command.name === Commands.Resume)

	if (resumeCommand && resumeCommand.description !== resume()) {
		resumeCommand.edit(resumeCommandData())
	}
	else {
		applicationCommands.create(resumeCommandData())
	}

	const leaveCommand = commands.find(command => command.name === Commands.Stop)

	if (leaveCommand && leaveCommand.description !== leave()) {
		leaveCommand.edit(stopCommandData())
	}
	else {
		applicationCommands.create(stopCommandData())
	}

	const radioCommand = commands.find(command => command.name === Commands.Radio)

	if (radioCommand && radioCommand.description) {
		radioCommand.edit(radioApplicationCommandData())
	}
	else {
		applicationCommands.create(radioApplicationCommandData())
	}
}


// This contains the setup code for creating slash commands in a guild. The owner of the bot can send "!deploy" to create them.
client.on('messageCreate', async (message) => {
	if (!message.guild) return;
	if (!client.application?.owner) await client.application?.fetch();

	if (message.author.id === '122930489580322818') {
		if (message.content.toLowerCase() === '!localdeploy') {
			localDeploy(message.guild)
		}

		if (message.content.toLowerCase() === '!globaldeploy') {
			globalDeploy()
		}
	
		if (message.content.toLowerCase() === '!test') {
		}
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

	const botMember = guild.me
	if (!(botMember instanceof GuildMember)) return

	const channel = member.voice.channel;

	if (!interaction.isCommand()) return;
	let subscription: MusicSubscription | undefined = subscriptions.get(guild.id);

	if (audioPossibleCommands(interaction.commandName as Commands)) {
		if (subscription) {
			const botChannel = botMember.voice.channel
			if (botChannel) {
				if (botChannel.members.size > 1 && botChannel !== channel) {
					interaction.reply({content: alreadyInUse(guild.id, botChannel), ephemeral: true})
					return;
				}
			}
		}
	}
	else return;

	if (interaction.commandName === Commands.Play) {
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

		if (!subscription || subscription?.radio) {
			if (channel) {
				subscription = new MusicSubscription(
					joinVoiceChannel({
						channelId: channel.id,
						guildId: channel.guild.id,
						adapterCreator: channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
					})
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
					// interaction.followUp({ content: currentlyPlaying(guild.id), ephemeral: true }).catch(console.warn);
				},
				onFinish() {
					// interaction.followUp({ content: finishedPlaying(guild.id), ephemeral: true }).catch(console.warn);é
				},
				onError(error) {
					console.warn(error);
					interaction.followUp({ content: errored(guild.id), ephemeral: true }).catch(console.warn);
				},
			});
			// Enqueue the track and reply a success message to the user
			subscription.enqueue(track);
			await interaction.followUp(addedToQueue(guild.id, track.title));
		} catch (error) {
			console.warn(error);
			await interaction.followUp(errored(guild.id));
		}
	} else if (interaction.commandName === Commands.Skip) {


		if (subscription) {
			if (subscription.radio) {
				await interaction.reply(noSkipRadio(guild.id));
				return;
			}

			// Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
			// listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
			// will be loaded and played.
			subscription.audioPlayer.stop();
			await interaction.reply(songSkipped(guild.id));



		} else {
			await interaction.reply(notPlaying(guild.id));
		}
	} else if (interaction.commandName === Commands.Queue) {
		// Print out the current queue, including up to the next 5 tracks to be played.
		if (subscription) {
			// const current =
			// 	subscription.audioPlayer.state.status === AudioPlayerStatus.Idle
			// 		? nothingCurrentlyPlaying(guild.id)
			// 		: playing(guild.id, (subscription.audioPlayer.state.resource as AudioResource<Track>).metadata.title);

			// const queue = subscription.queue
			// 	.slice(0, 5)
			// 	.map((track, index) => `${index + 1}- ${track.title}`)
			// 	.join('\n');

			// await interaction.reply(`${current}\n\n${queue}`);
			await interaction.reply({embeds: [songQueue(subscription.queue, guild.id)]});
		} else {
			await interaction.reply(notPlaying(guild.id));
		}
	} else if (interaction.commandName === Commands.Pause) {
		if (subscription) {

			if (subscription.radio) {
				await interaction.reply(noPauseRadio(guild.id));
				return;
			}


			subscription.audioPlayer.pause();
			await interaction.reply({ content: paused(guild.id), ephemeral: true });
		} else {
			await interaction.reply(notPlaying(guild.id));
		}
	} else if (interaction.commandName === Commands.Resume) {
		if (subscription) {
			subscription.audioPlayer.unpause();
			await interaction.reply({ content: unpaused(guild.id), ephemeral: true });
		} else {
			await interaction.reply(notPlaying(guild.id));
		}
	} else if (interaction.commandName === Commands.Stop) {
		if (subscription) {
			subscription.voiceConnection.destroy();
			subscriptions.delete(guild.id);
			await interaction.reply({ content: leftChannel(guild.id), ephemeral: true });
		} else {
			await interaction.reply(notPlaying(guild.id));
		}
	} 
	else if (interaction.commandName === Commands.Radio) {
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
							subscription.audioPlayer.stop()
							subscriptions.delete(guild.id)
							await interaction.followUp(playingRadioStation(guild.id, feed.name));
							subscription.radio = true
						} catch (error) {
							console.warn(error);
							return;
						}
					}
					// else {
					if (channel) {
						subscription = new MusicSubscription(
							joinVoiceChannel({
								channelId: channel.id,
								guildId: channel.guild.id,
								adapterCreator: channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
							}),
							true
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
					// }
				}
				else {
					interaction.followUp({content: noRadioFeedFound(guild.id, stationID)})
				}
			}
		}
		else if (subCommand === radioInfoSubCommandName(guild.id)) {
			if (option) {
				const stationID = option[0].value as number
				const feed = getFeed(stationID)

				if (feed) {
					interaction.followUp({embeds: [stationInfo(member, guild.id, feed)]})
				}
				else {
					interaction.followUp({content: noRadioFeedFound(guild.id, stationID)})
				}
			}
		}
		else if (subCommand === radioListSubCommandName(guild.id)) {
			if (option) {
				const country = option[0].value as Country
				interaction.followUp({embeds: [radioList(country, guild, member)]})
			}
		}
	} 
	else {
		return;
	}
});

client.on('error', console.warn);

void client.login(settings.token);