import { ApplicationCommandData, Snowflake } from "discord.js";
import { Commands, Country } from "./class";
import { leave, pause, playSong, queue, radio, radioInfoSubCommandDescription, radioInfoSubCommandName, radioListCountryName, radioListSubCommandCountryChoicesDescription, radioListSubCommandCountryChoicesName, radioListSubCommandDescription, radioListSubCommandName, radioStationSubCommandDescription, radioStationSubCommandName, radioStationSubCommandOptionName, resume, skip, songLink } from "./messages";

export function radioApplicationCommandData(guildID: Snowflake | undefined = undefined): ApplicationCommandData {
    return {
        name: 'radio',
        description: radio(guildID),
        options: [
            {
                name: radioStationSubCommandName(guildID),
                description: radioStationSubCommandDescription(guildID),
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'id',
                        description: radioStationSubCommandOptionName(guildID),
                        type: 'INTEGER',
                        required: true
                    }
                ]
            },
            {
                name: radioListSubCommandName(guildID),
                description: radioListSubCommandDescription(guildID),
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: radioListSubCommandCountryChoicesName(guildID),
                        description: radioListSubCommandCountryChoicesDescription(guildID),
                        type: 'STRING',
                        required: true,
                        choices: [
                            {
                                name: radioListCountryName(guildID, Country.CA),
                                value: Country.CA
                            },
                            {
                                name: radioListCountryName(guildID, Country.US),
                                value: Country.US
                            },
                            {
                                name: radioListCountryName(guildID, Country.FR),
                                value: Country.FR
                            }
                        ]
                    }
                ]
            },
            {
                name: radioInfoSubCommandName(guildID),
                description: radioInfoSubCommandDescription(guildID),
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'id',
                        description: radioStationSubCommandOptionName(guildID),
                        type: 'INTEGER',
                        required: true
                    }
                ]
            }
        ],
    }
}

export function playCommandData(guildID: Snowflake | undefined = undefined): ApplicationCommandData {
    return {
        name: 'play',
        description: playSong(guildID),
        options: [
            {
                name: 'song',
                type: 'STRING' as const,
                description: songLink(guildID),
                required: true,
            },
        ],
    }
}

export function skipCommandData(guildID: Snowflake | undefined = undefined): ApplicationCommandData {
    return {
        name: 'skip',
        description: skip(guildID),

    }
}

export function pauseCommandData(guildID: Snowflake | undefined = undefined): ApplicationCommandData {
    return {
        name: 'pause',
        description: pause(guildID),
    }
}

export function queueCommandData(guildID: Snowflake | undefined = undefined): ApplicationCommandData {
    return {
        name: 'queue',
        description: queue(guildID),
    }
}

export function resumeCommandData(guildID: Snowflake | undefined = undefined): ApplicationCommandData {
    return {
        name: 'resume',
        description: resume(guildID),
    }
}

export function stopCommandData(guildID: Snowflake | undefined = undefined): ApplicationCommandData {
    return {
        name: 'stop',
        description: leave(guildID),
    }
}

export function musicDeployCommandData(): ApplicationCommandData {
    return {
        name: Commands.MusicDeploy,
        description: 'Deploy Music Commands',
        defaultPermission: false,
        options: [{
            name: 'type',
            description: 'Type of deploy',
            type: 'STRING',
            choices: [{
                name: 'Global',
                value: 'global'
            },
            {
                name: 'Local',
                value: 'local'
            }]
        }]
    }
}

export function botInfoCommandData(): ApplicationCommandData {
    return {
        name: Commands.BotInfo,
        description: 'Get Bot informations',
        defaultPermission: false,
        options: [{
            name: 'music',
            description: 'Music or not?',
            type: 'BOOLEAN',
            required: true
        }]
    }
}
