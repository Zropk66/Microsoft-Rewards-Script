import { httpRequest } from '../util/Http'
import type { HttpRequestConfig } from '../util/Http'
import PQueue from 'p-queue'
import type { WebhookBarkConfig } from '../interface/Config'
import type { LogLevel } from './Logger'
import { flushQueue } from './Queue'

const barkQueue = new PQueue({
    interval: 1000,
    intervalCap: 2,
    carryoverConcurrencyCount: true
})

export async function sendBark(config: WebhookBarkConfig, content: string, level: LogLevel): Promise<void> {
    if (!config?.key) return

    const serverUrl = (config.serverUrl || 'https://api.day.app').replace(/\/+$/, '')
    const url = `${serverUrl}/${config.key}`

    const barkLevel = config.level ?? (level === 'error' ? 'timeSensitive' : 'active')

    const request: HttpRequestConfig = {
        method: 'POST',
        url,
        headers: { 'Content-Type': 'application/json' },
        data: {
            title: config.title ?? 'Microsoft Rewards',
            body: content,
            group: config.group ?? 'MicrosoftRewards',
            icon: config.icon,
            sound: config.sound,
            level: barkLevel,
            badge: config.badge
        },
        timeout: 10000
    }

    await barkQueue.add(async () => {
        try {
            await httpRequest(request)
        } catch (err) {
            const status = (err as { response?: { status?: number } })?.response?.status
            if (status === 429) return
        }
    })
}

export function flushBarkQueue(timeoutMs = 5000): Promise<void> {
    return flushQueue(barkQueue, timeoutMs)
}
