import { createBot, type Bot } from "mineflayer";


const HOST = process.env.HOST
const PORT = process.env.PORT !== undefined ? parseInt(process.env.PORT) || 25565 : 25565

const bots: { [name: string]: Bot } = {}

export async function startBot(name: string) {
    bots[name] = createBot({
        host: HOST,
        port: PORT,
        username: name,
        auth: "offline",
    })
}

export async function stopBot(name: string) {
    if (bots[name] !== undefined) {
        bots[name].end()
    }  
}
