import { MarpOptions } from '@marp-team/marp-core'
import nanoid from 'nanoid/generate'
import { useMemo } from 'react'

interface MarpReactOptions {
  containerClass: string
  identifier: string
  marpOptions: MarpOptions
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

const useIdentifier = (): string => useMemo(() => nanoid(chars, 8), [])

export default function useMarpOptions(
  opts: MarpOptions = {}
): MarpReactOptions {
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
