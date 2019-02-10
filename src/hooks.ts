import { Marp, MarpOptions } from '@marp-team/marp-core'
import nanoid from 'nanoid/generate'
import { useEffect, useLayoutEffect, useMemo } from 'react'

const identifierChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export const useGlobalStyle = (id: string, css: string) => {
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

export const useMarp = (opts: MarpOptions = {}): Marp => {
  useEffect(Marp.ready)
  return useMemo(() => new Marp(opts), [opts])
}

export default { useGlobalStyle, useIdentifier, useMarp }
