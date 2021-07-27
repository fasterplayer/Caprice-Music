import { GuildMember, MessageEmbed, Snowflake, StageChannel, VoiceChannel } from "discord.js";
import { Track } from "src/music/track";
import { Country, LiveFeed } from "./class";
import { isEnglish } from "./helpers";

export function musicLinkError(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'The provided link didn\'t return a song. Make sure that you are using a youtube link.'
    }
    else return 'Le lien fourni ne semble pas retourner une chanson valide. Assurez-vous de fournir un lien youtube valide.'
}

export function notInVcError(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Join a voice channel and then try that again!'
    }
    else return 'Veuillez rejoindre un salon vocal et recommencer.'
}

export function cantJoinVc(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Failed to join voice channel within 20 seconds, please try again later!'
    }
    else return 'Je n\'ai pas été en mesure de me connecter à votre salon vocal.'
}

export function currentlyPlaying(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Currently playing!'
    }
    else return 'Lecture en cours'
}

export function finishedPlaying(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Now finished!'
    }
    else return 'Lecture terminée'
}

export function errored(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'An error as occured.'
    }
    else return 'Une erreur est survenue.'
}

export function addedToQueue(guildID: Snowflake, title: string): string {
    if (isEnglish(guildID)) {
        return `Enqueued **${title}**`
    }
    else return `Ajoutée à la queue **${title}**`
}

export function songSkipped(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Skipped song!'
    }
    else return `Chanson suivante!`
}

export function notPlaying(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Not playing in this server!'
    }
    else return `Aucun contenu en cours de lecture!`
}

export function paused(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Paused!'
    }
    else return `Pause!`
}

export function unpaused(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return `Unpaused!`
    }
    else return `Reprise!`
}

export function leftChannel(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return `Left channel!`
    }
    else return `Salon vocal quitté!`
}

export function playSong(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) {
        return 'Plays a song'
    }
    else return `Jouer une chanson`
}

export function songLink(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) {
        return 'The youtube URL of the song to play'
    }
    else return `Le lien youtube de la chanson`
}

export function skip(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) {
        return 'Skip to the next song in the queue'
    }
    else return `Passer à la chanson suivante`
}

export function queue(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) {
        return 'See the music queue'
    }
    else return `Voir la liste des chansons en queue`
}

export function pause(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) {
        return 'Pauses/Unpauses the song that is currently playing'
    }
    else return `Mettre/Relancer la chanson sur pause`
}

export function resume(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) {
        return 'Resume playback of the current song'
    }
    else return `Reprendre la chanson en cours`
}

export function leave(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) {
        return 'Leave the voice channel and empty queue'
    }
    else return `Quitter le salon et vider la queue`
}

export function radio(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) {
        return 'Play Radio'
    }
    else return `Jouer la radio`
}

export function playingRadioStation(guildID: Snowflake, station: string | undefined = undefined): string {
    if (isEnglish(guildID)) {
        return `Playing **${station}**`
    }
    else return `Lecture de **${station}**`
}

export function radioCommandOption(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) {
        return `Radio ID or leave blank to get the list.`
    }
    else return `ID de la station ou laisser vide pour la liste`
}


export function noRadioCountryFound(guildID: Snowflake, country: string): string {
    if (isEnglish(guildID)) return `No radio feed has been found for ${country}.`
    else return `Aucune station radio n'a été trouvée pour le pays ${country}.`
}


export function noRadioFeedFound(guildID: Snowflake, id: number): string {
    if (isEnglish(guildID)) return `No radio feed has been found for id ${id}.`
    else return `Aucune station radio n'a été trouvée pour l'id ${id}.`
  }
  
export function radiosListByCountry(guildID: Snowflake, feedsList: LiveFeed[], country: Country, member: GuildMember): MessageEmbed {
    const description = feedsList.map(f => `${f.id} | ${f.name}`).join('\n')
    const embed = new MessageEmbed()
    .setColor(member.displayColor)
    .setAuthor(radioListCountryName(guildID, country))

    if (isEnglish(guildID)) {
        embed
        .setTitle(`Here is the list of preset radio Feeds for ${country}.`)
        .setFooter(`To listen to a radio station, use the command /radio station [id]`)
        .setDescription(description.length ? `\`\`\`yaml\n${description}\`\`\`` : 'None')

    }
    else {
        embed
        .setTitle(`Voici la liste des stations radio prédéfinies pour ${country}.`)
        .setFooter(`Pour écouter une station radio, utilisez la commande /radio station [id]`)
        .setDescription(description.length ? `\`\`\`yaml\n${description}\`\`\`` : 'Aucune')

    }
    return embed
}


export function radioStationSubCommandName(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) return `station`
    else return `station`
}

export function radioStationSubCommandDescription(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) return `Start playing a radio station by his Id.`
    else return `Lancer une station radio par son ID.`
}

export function radioStationSubCommandOptionName(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) return `Station ID`
    else return `ID de la station`
}

export function radioListSubCommandName(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) return `list`
    else return `liste`
}

export function radioInfoSubCommandName(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) return `stationinfo`
    else return `infostation`
}

export function radioListSubCommandDescription(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) return `Get the stations list from the specified country`
    else return `Obtenir la liste des stations radios selon le pays`
}

export function radioInfoSubCommandDescription(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) return `Get a radio station info`
    else return `Obtenir les informations d'une station radio`
}

export function radioListSubCommandCountryChoicesName(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) return `country`
    else return `pays`
}

export function radioListSubCommandCountryChoicesDescription(guildID: Snowflake | undefined = undefined): string {
    if (isEnglish(guildID)) return `Desired Country`
    else return `Pays désiré`
}

export function radioListCountryName(guildID: Snowflake | undefined = undefined, country: Country): string {

    if (country === Country.CA) {
        if (isEnglish(guildID)) return 'Canada'
        else return 'Canada'
    }

    if (country === Country.US) {
        if (isEnglish(guildID)) return 'United-States'
        else return 'États-Unis'
    }

    if (country === Country.FR) {
        if (isEnglish(guildID)) return 'France'
        else return 'France'
    }

    else return 'error'

}


export function stationInfo(member: GuildMember, guildID: Snowflake, liveFeed: LiveFeed): MessageEmbed {
    const embed = new MessageEmbed()
    .setColor(member.displayColor)
    .setTitle(liveFeed.name)
  
    embed
    .setThumbnail(liveFeed.icon)
  
    if (isEnglish(guildID)) {
        embed
        .addField(`Website`, `[${liveFeed.name}](${liveFeed.website})`, true)
        .addField(`Band`, `${liveFeed.band}`, true)
    }
    else {
        embed
        .addField(`Site Web`, `[${liveFeed.name}](${liveFeed.website})`, true)
        .addField(`Bande`, `${liveFeed.band}`, true)
    }

    return embed
}

export function nothingCurrentlyPlaying(guildID: Snowflake): string {
    if (isEnglish(guildID)) return `No song is currently playing.`
    else return `Aucune chanson n'est en cours de lecture.`
}

export function playing(guildID: Snowflake, content: string): string {
    if (isEnglish(guildID)) {
        return `Playing **${content}**`
    }
    else return `Lecture de **${content}**`
}

export function noSkipRadio(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Radio station cannot be skipped.'
    }
    else return `Vous ne pouvez pas "skip" une station radio.`
}

export function noPauseRadio(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Radio station cannot be paused.'
    }
    else return `Vous ne pouvez pas mettre en pause une station radio.`
}

export function alreadyInUse(guildID: Snowflake, channel: VoiceChannel | StageChannel): string {
    if (isEnglish(guildID)) {
        return `It seems like i am already in use in ${channel.toString()}`
    }
    else return `Il semble que je sois déjà en cours d'utilisation dans le salon ${channel.toString()}`
}

export function songQueue(queue: Track[], guildID: Snowflake): MessageEmbed {
  let description: string[] = []
  let title = `File d'attente (Queue)`
  let empty = 'La queue est vide'

  for (let i = 0; i < queue.length; i++) {
    if (i === 10) break
    description.push(`[${queue[i].title}](${queue[i].url})`)
  }

  if (isEnglish(guildID)) {
    title = `Queue`
    empty = 'The queue is Empty'
    if (queue.length > 10) description.push(`**And more...**`)
  }
  else if (queue.length > 10) description.push(`**Et plus...**`)
  
  const embed = new MessageEmbed()
  .setDescription(description.length ? description.join(`\n`) : empty)
  .setColor(`#0000FF`)
  .setTitle(title)

  return embed
}