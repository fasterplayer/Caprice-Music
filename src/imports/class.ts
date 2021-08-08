import { Snowflake, Guild } from "discord.js"

export class DbGuild {
    RpIp: string | null
    _id: Snowflake
    name: string
    autoChanMainID: Snowflake | null
    autoRole: Snowflake | null
    commandsChannels: Array<{
        id: Snowflake | null,
        name: string | null
    }>
    created: number
    english: boolean
    joinedAt: number
    newTickets: Snowflake | null
    owner: string | null
    ownerID: Snowflake
    prefix: string
    rpNames: Snowflake | null
    rpNamesRole: Snowflake | null
    staffRoleID: Snowflake | null
    supportChannel: Snowflake | null
    supportRole: {
        id: Snowflake | null,
        ticketMention: boolean
    }
    ticketParent: Snowflake | null
    welcomeChannel: Snowflake | null
    voicePlayers: boolean
    statusChannel: Snowflake | null
    apikey: string | null
    welcomeImage: string | null
    anonymous: Array<Snowflake>
    anonymousLogs: Snowflake | null
    logsChannel: Snowflake | null
    ticketsPanels: Array<{
        channelID: Snowflake,
        panelID: Snowflake
    }> | null
    statusMessages: Array<Snowflake> | undefined


    constructor (guild: Guild) {
        const owner = guild.members.cache.get(guild.ownerId)
        this._id = guild.id
        this.name = guild.name
        this.joinedAt = guild.joinedTimestamp
        this.owner = owner?.displayName ? owner.displayName : null
        this.ownerID = guild.ownerId
        this.created = guild.createdTimestamp
        this.supportRole = {
            id: null,
            ticketMention: false
        }
        this.staffRoleID = null
        this.ticketParent = null
        this.welcomeChannel = null
        this.autoRole = null
        this.newTickets = null
        this.autoChanMainID = null
        this.RpIp = null
        this.rpNames = null
        this.rpNamesRole = null
        this.prefix = '!'
        this.commandsChannels = [{
            name: null,
            id: null
        }]
        this.supportChannel = null
        this.english = false
        this.voicePlayers = false
        this.statusChannel = null
        this.apikey = null
        this.welcomeImage = null
        this.anonymous = []
        this.anonymousLogs = null
        this.logsChannel = null
        this.ticketsPanels = null
    }
}

export enum Country {
    CA = 'CA',
    US = 'US',
    FR = 'FR'
}

export class LiveFeed {
    country: string | null
    id: number
    name: string
    url: string
    website: string
    icon: string
    band: string

    constructor(country: string, id: number, name: string, url: string, website: string, icon: string, band: 'AM' | 'FM') {
        this.country = country
        this.id = id
        this.name = name
        this.url = url
        this.website = website
        this.icon = icon
        this.band = band
    }
}

export enum Commands {
    Play = 'play',
    Skip = 'skip',
    Pause = 'pause',
    Leave = 'leave',
    Stop = 'stop',
    Radio = 'radio',
    Queue = 'queue',
    Resume = 'resume',
    MusicDeploy = 'musicdeploy',
    BotInfo = 'botinfo'
}