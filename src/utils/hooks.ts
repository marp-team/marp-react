import { Marp, MarpOptions } from '@marp-team/marp-core'
import MarpReady from '@marp-team/marp-core/lib/browser.cjs'
import nanoid from 'nanoid/generate'
import { useLayoutEffect, useMemo } from 'react'

interface MarpReactOptions {
  containerClass: string
  identifier: string
  marpOptions: MarpOptions
}

const marpReadySymbol = Symbol('MarpReactReady')
const identifierChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export const useStyle = (id: string, css: string) => {
  useLayoutEffect(() => {
    const style =
      document.getElementById(id) ||
      (() => {
        const element = document.createElement('style')

        element.id = id
        document.head.appendChild(element)

        return element
      })()

    return () => style.remove()
  }, [id])

  useLayoutEffect(() => {
    const style = document.getElementById(id)
    if (style) style.textContent = css
  }, [id, css])
}

export const useIdentifier = (): string =>
  useMemo(() => nanoid(identifierChars, 8), [])

export const useMarpOptions = (opts: MarpOptions = {}): MarpReactOptions => {
  const identifier = useIdentifier()
  const containerClass = `marp-${identifier}`

  return useMemo(
    (): MarpReactOptions => ({
      containerClass,
      identifier,
      marpOptions: {
        ...(opts || {}),
        container: false,
        markdown: {
          ...((opts && opts.markdown) || {}),
          xhtmlOut: true,
        },
        slideContainer: { tag: 'div', class: containerClass },
      },
    }),
    [containerClass, identifier, opts]
  )
}

export const useMarpReady = () =>
  useLayoutEffect(() => {
    if (!window || window[marpReadySymbol]) return

    window[marpReadySymbol] = true
    MarpReady()
  }, [])

export const useMarp = (opts: MarpOptions = {}): Marp => {
  useMarpReady()
  return useMemo(() => new Marp(opts), [opts])
}
