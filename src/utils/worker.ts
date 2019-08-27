import { MarpOptions } from '@marp-team/marp-core'

const protocol = 'marp-react-v0'

interface MarpWorkerEvent extends MessageEvent {
  scope: string
}

interface MarpWorkerCommand {
  render(this: MarpWorkerEvent, markdown: string, opts: MarpOptions): void
  rendered(
    this: MarpWorkerEvent,
    result: { slides: any[]; css: string; comments: string[][] }
  ): void
}

export const listen = (
  worker: Worker,
  command: Partial<MarpWorkerCommand>,
  scope?: string
) => {
  const event = (e: MessageEvent) => {
    const [protocolId, scoped, cmd] = e.data

    if (protocol !== protocolId) return
    if (scope && scope !== scoped) return
    if (command[cmd]) {
      command[cmd].apply({ ...e, scope: scoped }, e.data.slice(3))
    }
  }

  worker.addEventListener('message', event)
  return () => worker.removeEventListener('message', event)
}

export const send = <T extends keyof MarpWorkerCommand>(
  worker: Worker,
  scope: string,
  command: T,
  ...args: MarpWorkerCommand[T] extends (
    this: MarpWorkerEvent,
    ...args: infer R
  ) => any
    ? R
    : never
) => worker.postMessage([protocol, scope, command, ...args])
