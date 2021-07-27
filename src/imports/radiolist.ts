import { Message, Guild, GuildMember, MessageEmbed } from "discord.js"
import fs from 'fs'
import path from "path"
import { noRadioCountryFound, radiosListByCountry } from "./messages"

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


export function radioList(country: string, guild: Guild, member: GuildMember): MessageEmbed {

        const feedList = getFeedByCountry(country)
        // if (!feedList.length) return noRadioCountryFound(guild.id, country)
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