import { Guild, GuildMember, MessageEmbed } from "discord.js"
import fs from 'fs'
import path from "path"
import { Country, LiveFeed } from "./class"
import { radiosListByCountry } from "./messages"




export function radioList(country: Country, guild: Guild, member: GuildMember): MessageEmbed {

        const feedList = getFeedByCountry(country)
        return radiosListByCountry(guild.id, feedList, country, member)
}

export function getFeed(id: number): LiveFeed | undefined {
    return feeds().find(f => f.id === id)
}

function getFeedByCountry(country: string): Array<LiveFeed> {
    return feeds().filter(f => f.country && f.country.toLowerCase() === country.toLowerCase())
}

function feeds(): Array<LiveFeed> {
    return JSON.parse(fs.readFileSync(`${path.resolve('index.ts' + '/..')}/live-feeds.json`, 'utf8')).feeds
}