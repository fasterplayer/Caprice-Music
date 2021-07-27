import { ApplicationCommandData, Snowflake } from "discord.js";
import { radio, radioInfoSubCommandDescription, radioInfoSubCommandName, radioListCountryName, radioListSubCommandCountryChoicesDescription, radioListSubCommandCountryChoicesName, radioListSubCommandDescription, radioListSubCommandName, radioStationSubCommandDescription, radioStationSubCommandName, radioStationSubCommandOptionName } from "./messages";

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
                                name: radioListCountryName(guildID, 'CA'),
                                value: 'CA'
                            },
                            {
                                name: radioListCountryName(guildID, 'US'),
                                value: 'US'
                            },
                            {
                                name: radioListCountryName(guildID, 'FR'),
                                value: 'FR'
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