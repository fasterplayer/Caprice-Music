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
import { addedToQueue, cantJoinVc, currentlyPlaying, errored, finishedPlaying, leave, leftChannel, musicLinkError, notInVcError, notPlaying, pause, paused, playingRadioStation, playSong, queue, radio, radioCommandOption, resume, skip, songLink, songSkipped, unpaused } from './imports/messages';
import settings from './imports/settings';
import { errorsHandler, sendError, sendInterval } from './imports/error-handler';
import { guildCache } from './imports/helpers';

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

	if (radioCommand && radioCommand.description !== radio(guild.id)) {
		radioCommand.edit({
			name: 'radio',
			description: radio(guild.id),
			options: [
				{
					name: 'id',
					type: 'INTEGER',
					description: radioCommandOption(guild.id),
					required: false,
				},
			],
		})
	}
	else {
		guild.commands.create({
			name: 'radio',
			description: radio(guild.id),
			options: [
				{
					name: 'id',
					type: 'INTEGER',
					description: radioCommandOption(guild.id),
					required: false,
				},
			],
		})
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
	if (!interaction.isCommand() || !interaction.guildId) return;
	let subscription = subscriptions.get(interaction.guildId);

	if (interaction.commandName === 'play') {
		await interaction.defer();
		// Extract the video URL from the command
		const url = interaction.options.get('song')!.value! as string;
		const ytbLink: boolean = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/.test(url)

		if (!ytbLink) {
			await interaction.followUp(musicLinkError(interaction.guildId));
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
				subscriptions.set(interaction.guildId, subscription);
			}
		}

		// If there is no subscription, tell the user they need to join a channel.
		if (!subscription) {
			await interaction.followUp(notInVcError(interaction.guildId));
			return;
		}

		// Make sure the connection is ready before processing the user's request
		try {
			await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
		} catch (error) {
			console.warn(error);
			await interaction.followUp(cantJoinVc(interaction.guildId));
			return;
		}

		try {
			// Attempt to create a Track from the user's video URL
			const track = await Track.from(url, {
				onStart() {
					interaction.followUp({ content: currentlyPlaying(interaction.guildId as Snowflake), ephemeral: true }).catch(console.warn);
				},
				onFinish() {
					interaction.followUp({ content: finishedPlaying(interaction.guildId as Snowflake), ephemeral: true }).catch(console.warn);
				},
				onError(error) {
					console.warn(error);
					interaction.followUp({ content: errored(interaction.guildId as Snowflake), ephemeral: true }).catch(console.warn);
				},
			});
			// Enqueue the track and reply a success message to the user
			subscription.enqueue(track);
			await interaction.followUp(addedToQueue(interaction.guildId, track.title));
		} catch (error) {
			console.warn(error);
			await interaction.followUp(errored(interaction.guildId));
		}
	} else if (interaction.commandName === 'skip') {
		if (subscription) {
			// Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
			// listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
			// will be loaded and played.
			subscription.audioPlayer.stop();
			await interaction.reply(songSkipped(interaction.guildId));
		} else {
			await interaction.reply(notPlaying(interaction.guildId));
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
			await interaction.reply(notPlaying(interaction.guildId));
		}
	} else if (interaction.commandName === 'pause') {
		if (subscription) {
			subscription.audioPlayer.pause();
			await interaction.reply({ content: paused(interaction.guildId), ephemeral: true });
		} else {
			await interaction.reply(notPlaying(interaction.guildId));
		}
	} else if (interaction.commandName === 'resume') {
		if (subscription) {
			subscription.audioPlayer.unpause();
			await interaction.reply({ content: unpaused(interaction.guildId), ephemeral: true });
		} else {
			await interaction.reply(notPlaying(interaction.guildId));
		}
	} else if (interaction.commandName === 'leave') {
		if (subscription) {
			subscription.voiceConnection.destroy();
			subscriptions.delete(interaction.guildId);
			await interaction.reply({ content: leftChannel(interaction.guildId), ephemeral: true });
		} else {
			await interaction.reply(notPlaying(interaction.guildId));
		}
	} 
	else if (interaction.commandName === 'radio') {
		await interaction.defer();
		const int = interaction.options.data[0].value

		if (int === 0) {



		}







		if (subscription) {
			// subscription.voiceConnection.destroy();
			if (subscription.voiceConnection) {
				subscriptions.delete(interaction.guildId);
				await interaction.reply({ content: leftChannel(interaction.guildId), ephemeral: true });
			}
			
		}
		else {
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
				subscriptions.set(interaction.guildId, subscription);
			}
			
			
			// If there is no subscription, tell the user they need to join a channel.
			if (!subscription) {
				console.log(1)
					await interaction.followUp(notInVcError(interaction.guildId));
					return;
			}
				// Make sure the connection is ready before processing the user's request

			try {
				await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
				playRadio('https://cogecomedia.leanstream.co/CKOIFM-MP3', subscription.voiceConnection)
				await interaction.followUp(playingRadioStation(interaction.guildId, ''));
			} catch (error) {
				console.warn(error);
				await interaction.followUp(cantJoinVc(interaction.guildId));
				return;
			}

		}
	} 
	// else {
	// 	await interaction.reply('Unknown command');
	// }
});

client.on('error', console.warn);

void client.login(settings.token);


