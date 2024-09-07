import type { Bot } from "mineflayer";
import { EventEmitter } from "stream";
import type TypedEventEmitter from "typed-emitter";
import { Worker, isMainThread, parentPort } from "worker_threads";


export type BotPoolWorkerEvents = {
    // To worker events
    start: (name: string) => void
    stop: (name: string) => void

    // From worker events
    ready: () => void
    started: (name: string) => void
    stopped: (name: string) => void

}

export interface BotPoolWorker extends TypedEventEmitter<BotPoolWorkerEvents> {
    _worker: Worker
}


export function startPoolWorker() : BotPoolWorker {
    // @ts-ignore
    const botPoolWorker: BotPoolWorker = new EventEmitter()
    botPoolWorker._worker = new Worker(__filename)
    
    const originalEmit = botPoolWorker.emit.bind(botPoolWorker)
    botPoolWorker.emit = function<E extends keyof BotPoolWorkerEvents>(event: E, ...args: Parameters<BotPoolWorkerEvents[E]>): boolean {
        botPoolWorker._worker.postMessage(
            {
                event: event,
                args: args
            }
        )
        return true
    }

    botPoolWorker._worker.on("message", (msg) => {
        originalEmit(msg.event, ...msg.args)
    })

    return botPoolWorker
}



if (!isMainThread) {
    const eventEmitter = new EventEmitter() as TypedEventEmitter<BotPoolWorkerEvents>

    const originalEmit = eventEmitter.emit.bind(eventEmitter)
    eventEmitter.emit = function<E extends keyof BotPoolWorkerEvents>(event: E, ...args: Parameters<BotPoolWorkerEvents[E]>): boolean {
        parentPort?.postMessage(
            {
                event: event,
                args: args
            }
        )
        return true
    }

    parentPort?.on("message", (msg) => {
        originalEmit(msg.event, ...msg.args)
    })    

    eventEmitter.on("start", (name) => {
        console.log(`Starting bot ${name}`)
    })

    eventEmitter.on("stop", (name) => {
        console.log(`Stopping bot ${name}`)
    })

    eventEmitter.emit("ready")
}
