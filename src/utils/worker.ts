import { MarpOptions } from '@marp-team/marp-core'

const identifier = 'marp'

interface MarpWorkerCommand {
  render(markdown: string, opts: MarpOptions): void
  rendered(result: { slides: any[]; css: string; comments: string[][] }): void
}

export const listen = (worker: Worker, command: Partial<MarpWorkerCommand>) => {
  const event = e => {
    const [id, cmd] = e.data

    if (identifier !== id) return
    if (command[cmd]) command[cmd](...e.data.slice(2))
  }

  worker.addEventListener('message', event)
  return () => worker.removeEventListener('message', event)
}

export const send = <T extends keyof MarpWorkerCommand>(
  worker: Worker,
  command: T,
  ...args: MarpWorkerCommand[T] extends (...args: infer R) => any ? R : never
) => worker.postMessage([identifier, command, ...args])
