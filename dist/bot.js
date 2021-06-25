"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var voice_1 = require("@discordjs/voice");
var track_1 = require("./music/track");
var subscription_1 = require("./music/subscription");
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
var token = require('../auth.json').token;
var client = new discord_js_1["default"].Client({ intents: ['GUILD_VOICE_STATES', 'GUILD_MESSAGES', 'GUILDS'] });
client.on('ready', function () { return console.log('Ready!'); });
// This contains the setup code for creating slash commands in a guild. The owner of the bot can send "!deploy" to create them.
client.on('message', function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!message.guild)
                    return [2 /*return*/];
                if (!!((_a = client.application) === null || _a === void 0 ? void 0 : _a.owner)) return [3 /*break*/, 2];
                return [4 /*yield*/, ((_b = client.application) === null || _b === void 0 ? void 0 : _b.fetch())];
            case 1:
                _e.sent();
                _e.label = 2;
            case 2:
                if (!(message.content.toLowerCase() === '!deploy' && message.author.id === ((_d = (_c = client.application) === null || _c === void 0 ? void 0 : _c.owner) === null || _d === void 0 ? void 0 : _d.id))) return [3 /*break*/, 5];
                return [4 /*yield*/, message.guild.commands.set([
                        {
                            name: 'play',
                            description: 'Plays a song',
                            options: [
                                {
                                    name: 'song',
                                    type: 'STRING',
                                    description: 'The URL of the song to play',
                                    required: true
                                },
                            ]
                        },
                        {
                            name: 'skip',
                            description: 'Skip to the next song in the queue'
                        },
                        {
                            name: 'queue',
                            description: 'See the music queue'
                        },
                        {
                            name: 'pause',
                            description: 'Pauses the song that is currently playing'
                        },
                        {
                            name: 'resume',
                            description: 'Resume playback of the current song'
                        },
                        {
                            name: 'leave',
                            description: 'Leave the voice channel'
                        },
                    ])];
            case 3:
                _e.sent();
                return [4 /*yield*/, message.reply('Deployed!')];
            case 4:
                _e.sent();
                _e.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * Maps guild IDs to music subscriptions, which exist if the bot has an active VoiceConnection to the guild.
 */
var subscriptions = new Map();
// Handles slash command interactions
client.on('interaction', function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var subscription, url, channel, error_1, track, error_2, current, queue;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!interaction.isCommand() || !interaction.guildID)
                    return [2 /*return*/];
                subscription = subscriptions.get(interaction.guildID);
                if (!(interaction.commandName === 'play')) return [3 /*break*/, 13];
                return [4 /*yield*/, interaction.defer()];
            case 1:
                _a.sent();
                url = interaction.options.get('song').value;
                // If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
                // and create a subscription.
                if (!subscription) {
                    if (interaction.member instanceof discord_js_1.GuildMember && interaction.member.voice.channel) {
                        channel = interaction.member.voice.channel;
                        subscription = new subscription_1.MusicSubscription(voice_1.joinVoiceChannel({
                            channelId: channel.id,
                            guildId: channel.guild.id,
                            adapterCreator: channel.guild.voiceAdapterCreator
                        }));
                        subscription.voiceConnection.on('error', console.warn);
                        subscriptions.set(interaction.guildID, subscription);
                    }
                }
                if (!!subscription) return [3 /*break*/, 3];
                return [4 /*yield*/, interaction.followUp('Join a voice channel and then try that again!')];
            case 2:
                _a.sent();
                return [2 /*return*/];
            case 3:
                _a.trys.push([3, 5, , 7]);
                return [4 /*yield*/, voice_1.entersState(subscription.voiceConnection, voice_1.VoiceConnectionStatus.Ready, 20e3)];
            case 4:
                _a.sent();
                return [3 /*break*/, 7];
            case 5:
                error_1 = _a.sent();
                console.warn(error_1);
                return [4 /*yield*/, interaction.followUp('Failed to join voice channel within 20 seconds, please try again later!')];
            case 6:
                _a.sent();
                return [2 /*return*/];
            case 7:
                _a.trys.push([7, 10, , 12]);
                return [4 /*yield*/, track_1.Track.from(url, {
                        onStart: function () {
                            interaction.followUp({ content: 'Now playing!', ephemeral: true })["catch"](console.warn);
                        },
                        onFinish: function () {
                            interaction.followUp({ content: 'Now finished!', ephemeral: true })["catch"](console.warn);
                        },
                        onError: function (error) {
                            console.warn(error);
                            interaction.followUp({ content: "Error: " + error.message, ephemeral: true })["catch"](console.warn);
                        }
                    })];
            case 8:
                track = _a.sent();
                // Enqueue the track and reply a success message to the user
                subscription.enqueue(track);
                return [4 /*yield*/, interaction.followUp("Enqueued **" + track.title + "**")];
            case 9:
                _a.sent();
                return [3 /*break*/, 12];
            case 10:
                error_2 = _a.sent();
                console.warn(error_2);
                return [4 /*yield*/, interaction.reply('Failed to play track, please try again later!')];
            case 11:
                _a.sent();
                return [3 /*break*/, 12];
            case 12: return [3 /*break*/, 40];
            case 13:
                if (!(interaction.commandName === 'skip')) return [3 /*break*/, 18];
                if (!subscription) return [3 /*break*/, 15];
                // Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
                // listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
                // will be loaded and played.
                subscription.audioPlayer.stop();
                return [4 /*yield*/, interaction.reply('Skipped song!')];
            case 14:
                _a.sent();
                return [3 /*break*/, 17];
            case 15: return [4 /*yield*/, interaction.reply('Not playing in this server!')];
            case 16:
                _a.sent();
                _a.label = 17;
            case 17: return [3 /*break*/, 40];
            case 18:
                if (!(interaction.commandName === 'queue')) return [3 /*break*/, 23];
                if (!subscription) return [3 /*break*/, 20];
                current = subscription.audioPlayer.state.status === voice_1.AudioPlayerStatus.Idle
                    ? "Nothing is currently playing!"
                    : "Playing **" + subscription.audioPlayer.state.resource.metadata.title + "**";
                queue = subscription.queue
                    .slice(0, 5)
                    .map(function (track, index) { return index + 1 + ") " + track.title; })
                    .join('\n');
                return [4 /*yield*/, interaction.reply(current + "\n\n" + queue)];
            case 19:
                _a.sent();
                return [3 /*break*/, 22];
            case 20: return [4 /*yield*/, interaction.reply('Not playing in this server!')];
            case 21:
                _a.sent();
                _a.label = 22;
            case 22: return [3 /*break*/, 40];
            case 23:
                if (!(interaction.commandName === 'pause')) return [3 /*break*/, 28];
                if (!subscription) return [3 /*break*/, 25];
                subscription.audioPlayer.pause();
                return [4 /*yield*/, interaction.reply({ content: "Paused!", ephemeral: true })];
            case 24:
                _a.sent();
                return [3 /*break*/, 27];
            case 25: return [4 /*yield*/, interaction.reply('Not playing in this server!')];
            case 26:
                _a.sent();
                _a.label = 27;
            case 27: return [3 /*break*/, 40];
            case 28:
                if (!(interaction.commandName === 'resume')) return [3 /*break*/, 33];
                if (!subscription) return [3 /*break*/, 30];
                subscription.audioPlayer.unpause();
                return [4 /*yield*/, interaction.reply({ content: "Unpaused!", ephemeral: true })];
            case 29:
                _a.sent();
                return [3 /*break*/, 32];
            case 30: return [4 /*yield*/, interaction.reply('Not playing in this server!')];
            case 31:
                _a.sent();
                _a.label = 32;
            case 32: return [3 /*break*/, 40];
            case 33:
                if (!(interaction.commandName === 'leave')) return [3 /*break*/, 38];
                if (!subscription) return [3 /*break*/, 35];
                subscription.voiceConnection.destroy();
                subscriptions["delete"](interaction.guildID);
                return [4 /*yield*/, interaction.reply({ content: "Left channel!", ephemeral: true })];
            case 34:
                _a.sent();
                return [3 /*break*/, 37];
            case 35: return [4 /*yield*/, interaction.reply('Not playing in this server!')];
            case 36:
                _a.sent();
                _a.label = 37;
            case 37: return [3 /*break*/, 40];
            case 38: return [4 /*yield*/, interaction.reply('Unknown command')];
            case 39:
                _a.sent();
                _a.label = 40;
            case 40: return [2 /*return*/];
        }
    });
}); });
client.on('error', console.warn);
void client.login(token);
