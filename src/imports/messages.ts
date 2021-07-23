import { Snowflake } from "discord.js";
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

export function playSong(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Plays a song'
    }
    else return `Jouer une chanson`
}

export function songLink(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'The youtube URL of the song to play'
    }
    else return `Le lien youtube de la chanson`
}

export function skip(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Skip to the next song in the queue'
    }
    else return `Passer à la chanson suivante`
}

export function queue(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'See the music queue'
    }
    else return `Voir la liste des chansons en queue`
}

export function pause(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Pauses the song that is currently playing'
    }
    else return `Mettre la chanson sur pause`
}

export function resume(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Resume playback of the current song'
    }
    else return `Reprendre la chanson en cours`
}

export function leave(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Leave the voice channel and empty queue'
    }
    else return `Quitter le salon et vider la queue`
}

export function radio(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return 'Play Radio'
    }
    else return `Jouer la radio`
}

export function playingRadioStation(guildID: Snowflake, station: string): string {
    if (isEnglish(guildID)) {
        return `Playing ${station}`
    }
    else return `Lecture de ${station}`
}

export function radioCommandOption(guildID: Snowflake): string {
    if (isEnglish(guildID)) {
        return `Radio ID or leave blank to get the list.`
    }
    else return `ID de la station ou laisser vide pour la liste`
}








