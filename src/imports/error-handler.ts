import { Client, MessageEmbed, RateLimitData, User, WebhookClient, WebhookMessageOptions } from "discord.js";

export const errorWebhook = new WebhookClient({id: `809502340646174740`, token: `l2Qxk9PBodH2u8pOF7LT6GdoNdaUtS8icnHJG1mGObKK-F2vJvMSFo1T4cZP72HpLyVM`})
export const rateLimitWebhook = new WebhookClient({id: `829872136867938305`, token: `Em-1gRQJ9VlDlcWzxOwlLg7h1BWe_F3QKvmPjdW2bvQQ3vCQLCJFLADD4f-z4jR3X0Qo`})

const errorWebhookSendQueue: Map<Date, {content: string | (WebhookMessageOptions & { split?: false })}> = new Map()

const rateLimitSendQueue: Map<Date, {content: string | (WebhookMessageOptions & { split?: false })}> = new Map()

export function sendError(errorType: string, clientUser: User | null, err: Error, details: string | undefined = undefined) {
    
    if (!(clientUser instanceof User)) return false
    const embed = new MessageEmbed()

    const avatarURL = clientUser.displayAvatarURL() ? clientUser.displayAvatarURL(): clientUser.defaultAvatarURL

    embed
    .setTitle(errorType)
    .setAuthor(clientUser.username + ' (Music)', avatarURL)
    .setDescription(`\`\`\`ts
${(err.stack && err.stack.length > 2000) ? err.stack.substring(0, 2000):  err.stack ? err.stack : err.message}\`\`\``)
    .setFooter(err.message)

    if (details) {
        embed.addField('Additionnal details', details, false)
    }


    const sendContent = {
        content: details,
        embeds: [embed],
        username: clientUser.username,
        avatarURL
    }
    errorWebhookSendQueue.set(new Date(), {content: sendContent})
}

export function sendInterval(client: Client) {
    setInterval(() => {
        if (errorWebhookSendQueue.size) {
            try {
                const first = Array.from(errorWebhookSendQueue)[0]
                errorWebhook.send(first[1].content)
                errorWebhookSendQueue.delete(first[0])
            }
            catch (err) {
                console.log(err)
            }
        }

        if (rateLimitSendQueue.size) {
            try {
                const first = Array.from(rateLimitSendQueue)[0]
                rateLimitWebhook.send(first[1].content)
                rateLimitSendQueue.delete(first[0])
            }
            catch (err) {
                console.log(err)
            }
        }
    }, 2000)
}

export function sendRateLimits(errorName: string, clientUser: User | null, limit: RateLimitData) {
    if (!(clientUser instanceof User)) return false
    const embed = new MessageEmbed()

    const avatarURL = clientUser.displayAvatarURL() ? clientUser.displayAvatarURL(): clientUser.defaultAvatarURL

    embed
    .setTitle(errorName)
    .setAuthor(clientUser.username + ' (Music)', avatarURL)
    .setDescription(`Global: ${limit.global}
    Limit: ${limit.limit}
    Method: ${limit.method}
    Path: ${limit.path}
    Route: ${limit.route}
    Timeout: ${limit.timeout}`)

    const sendContent = {
        embeds: [embed],
        username: clientUser.username,
        avatarURL
    }

    rateLimitSendQueue.set(new Date(), {content: sendContent})

}

export function sendPromiseError(clientUser: User | null, reason: string | undefined, promise: Promise<any>) {
    if (!(clientUser instanceof User)) return false
    const embed = new MessageEmbed()

    const avatarURL = clientUser.displayAvatarURL() ? clientUser.displayAvatarURL(): clientUser.defaultAvatarURL

    embed
    .setTitle(`Promise Error`)
    .setAuthor(clientUser.username + ' (Music)', avatarURL)
    .setDescription(`\`\`\`ts
    ${promise}\`\`\``)
    .setFooter(reason ? reason : 'No reason')

    const sendContent = {
        embeds: [embed],
        username: clientUser.username,
        avatarURL
    }

    errorWebhookSendQueue.set(new Date(), {content: sendContent})
    
}

// This function makes me receive uncatched errors in a webhook to prevent them in the future
// If you update the webhookClient with your own webhook details, you will be the only one to receive unhandled errors
export async function errorsHandler(client: Client) {

    process.on('unhandledRejection', (reason: {statusCode: string, message: string}, p: Promise<any>) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    });

    process.on('unhandledRejection', (err: Error) => {
        sendError('unhandledRejection', client.user, err)
    });
    
    process.on('uncaughtException', (err: Error) => {
        console.log(err)
        sendError('uncaughtException', client.user, err)
    });
    
    process.on('rejectionHandled', (err: Error) => {
        console.log(err)
        sendError('rejectionHandled', client.user, err)
    });

}