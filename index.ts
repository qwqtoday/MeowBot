import { startPoolWorker } from "./BotPoolWorker";

const botPoolWorker = startPoolWorker()


botPoolWorker.on("ready", () => {
    console.log("Bot pool ready.")
    
})