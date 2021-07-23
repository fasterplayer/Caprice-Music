export function radioList(message: Message, country: string, guild: Guild, member: GuildMember, prefix: string) {
    if (!country || !availableCountry().includes(country.toUpperCase())) {
        return messageReply(message, {embeds:[radioListEmbed(guild.id)]})
    }
    else {
        const feedList = getFeedByCountry(country)
        // if (!feedList.length) return messageReply(message, noRadioCountryFound(guild.id, country))
        // return messageReply(message, {embeds:[radiosListByCountry(guild.id, feedList, country, member, prefix)]})
    }
}