import { Marp } from '@marp-team/marp-core'
import parse from './utils/parse'
import { listen, send } from './utils/worker'

/* eslint-disable-next-line no-restricted-globals */
export default function initialize(worker: Worker = self as any) {
  return listen(worker, {
    render(markdown, opts) {
      const marp = new Marp(opts)
      const { html, css, comments } = marp.render(markdown, {
        htmlAsArray: true,
      })

      send(worker, this.scope, 'rendered', {
        slides: html.map(h => parse(h)),
        css,
        comments,
      })
    },
  })
}
