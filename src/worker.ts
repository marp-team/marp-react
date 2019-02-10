import { Marp, MarpOptions } from '@marp-team/marp-core'
import { parse } from './parser'

const identifier = 'marp'

export enum MarpWorkerCommand {
  Render = 'render',
}

const send = (worker: Worker, command: MarpWorkerCommand, ...args: any[]) =>
  worker.postMessage([identifier, command, ...args])

export const render = (
  worker: Worker,
  markdown: string,
  opts: MarpOptions = {}
) => send(worker, MarpWorkerCommand.Render, markdown, opts)

export const listen = (
  worker: Worker,
  command: { [cmd in MarpWorkerCommand]?: (...args: any) => void }
) => {
  const event = e => {
    const [id, cmd] = e.data

    if (identifier !== id) return
    if (command[cmd]) command[cmd](...e.data.slice(2))
  }

  worker.addEventListener('message', event)
  return () => worker.removeEventListener('message', event)
}

export default function initialize() {
  const worker: Worker = <any>self

  return listen(worker, {
    render: (markdown: string, opts: MarpOptions) => {
      const marp = new Marp(opts)
      const { html, css, comments } = marp.render(markdown, {
        htmlAsArray: true,
      })

      send(worker, MarpWorkerCommand.Render, {
        html: html.map(h => parse(h)),
        css,
        comments,
      })
    },
  })
}
