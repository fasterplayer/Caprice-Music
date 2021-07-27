import { ApplicationCommandData, Snowflake } from "discord.js";
import { Country } from "./class";
import { leave, pause, playSong, queue, radio, radioInfoSubCommandDescription, radioInfoSubCommandName, radioListCountryName, radioListSubCommandCountryChoicesDescription, radioListSubCommandCountryChoicesName, radioListSubCommandDescription, radioListSubCommandName, radioStationSubCommandDescription, radioStationSubCommandName, radioStationSubCommandOptionName, resume, skip, songLink } from "./messages";

export function radioApplicationCommandData(guildID: Snowflake): ApplicationCommandData {
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

export function playCommandData(guildID: Snowflake): ApplicationCommandData {
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

export function skipCommandData(guildID: Snowflake): ApplicationCommandData {
    return {
        name: 'skip',
        description: skip(guildID),

    }
}

export function pauseCommandData(guildID: Snowflake): ApplicationCommandData {
    return {
        name: 'pause',
        description: pause(guildID),
    }
}

export function queueCommandData(guildID: Snowflake): ApplicationCommandData {
    return {
        name: 'queue',
        description: queue(guildID),
    }
}

export function resumeCommandData(guildID: Snowflake): ApplicationCommandData {
    return {
        name: 'resume',
        description: resume(guildID),
    }
}

export function stopCommandData(guildID: Snowflake): ApplicationCommandData {
    return {
        name: 'stop',
        description: leave(guildID),
    }
}
