import { Client, Guild, GuildChannel, Role, Snowflake, ThreadChannel } from "discord.js"
import { Commands, DbGuild } from "./class"
import { dbGuild } from "./firebase"
import admin from 'firebase-admin'

export const guildsCache: Map<Snowflake, DbGuild> = new Map()

export async function guildDB(guild: Guild) {
    const guildRef: admin.firestore.DocumentReference = dbGuild.doc(guild.id)
    const guildSnapshot: admin.firestore.DocumentData = await guildRef.get()

    if (guildSnapshot.exists) return false

    
    const staffRole: Role | undefined = guild.roles.cache.find((r: Role) => r.name.toLowerCase().includes('staff'))
    const ticketParent: GuildChannel | ThreadChannel | undefined = guild.channels.cache.find(c => c.name.toLowerCase().includes(`ticket`) && c.type === 'GUILD_CATEGORY')
    const supportRole: Role | undefined = guild.roles.cache.find((r: Role) => r.name.toLowerCase().includes('support'))

    const guildData: DbGuild = new DbGuild(guild)

    if (staffRole) {
        guildData.staffRoleID = staffRole.id
    }

    if (ticketParent) {
        guildData.ticketParent = ticketParent.id
    }

    if (supportRole) {
        guildData.supportRole = {
            id: supportRole.id,
            ticketMention: false
        }
    }

    const guildDbData: DbGuild = {
        RpIp: guildData.RpIp,
        _id: guildData._id,
        name: guildData.name,
        autoChanMainID: guildData.autoChanMainID,
        autoRole: guildData.autoRole,
        commandsChannels: guildData.commandsChannels,
        created: guildData.created,
        english: guildData.english,
        joinedAt: guildData.joinedAt,
        newTickets: guildData.newTickets,
        owner: guildData.owner,
        ownerID: guildData.ownerID,
        prefix: guildData.prefix,
        rpNames: guildData.rpNames,
        rpNamesRole: guildData.rpNamesRole,
        staffRoleID: guildData.staffRoleID,
        supportChannel: guildData.supportChannel,
        supportRole: guildData.supportRole,
        ticketParent: guildData.ticketParent,
        welcomeChannel: guildData.welcomeChannel,
        voicePlayers: guildData.voicePlayers,
        statusChannel: guildData.statusChannel,
        apikey: guildData.apikey,
        welcomeImage: guildData.welcomeImage,
        anonymous: guildData.anonymous,
        anonymousLogs: guildData.anonymousLogs,
        logsChannel: guildData.logsChannel,
        ticketsPanels: guildData.ticketsPanels,
        statusMessages: []
    }
        
    return guildRef.set(guildDbData)
}

export function isEnglish(guildID: string): boolean {
    const guildData: DbGuild | undefined = guildsCache.get(guildID as Snowflake)
    if (!guildData) return false
  
    if (guildData.english) return true
    else return false
}

export function getGuildPrefix(guildID: string): string {
    const guildData: DbGuild | undefined = guildsCache.get(guildID as Snowflake)
    if (!guildData) return '!'
  
    return guildData.prefix
}

export function guildCacheListener(guild: Guild, client: Client) {
    dbGuild.doc(guild.id).onSnapshot(async snapshot => {
        const guildData = snapshot.data()
        if (!guildData) return false

        guildsCache.set(snapshot.id as Snowflake, guildData as DbGuild)
    })
}

export async function getGuildFromDB(guild: Guild): Promise<DbGuild | undefined> {
    const guildRef: admin.firestore.DocumentReference = dbGuild.doc(guild.id)
    const guildSnapshot: admin.firestore.DocumentData = await guildRef.get()
  
    if (guildSnapshot.exists) {
      return guildSnapshot.data()
    } else return undefined
  } 

export async function guildCache(guild: Guild, client: Client) {
    await guildDB(guild)
    const guildData = await getGuildFromDB(guild)
    if (!guildData) return false

    guildsCache.set(guild.id, guildData)
    
    return guildCacheListener(guild, client)
}

export function audioPossibleCommands(command: Commands): boolean {
    return Object.values(Commands).includes(command)
}