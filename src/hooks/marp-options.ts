import { MarpOptions } from '@marp-team/marp-core'
import { customAlphabet } from 'nanoid'
import { useMemo } from 'react'

interface MarpReactOptions {
  containerClass: string
  identifier: string
  marpOptions: MarpOptions
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(chars, 8)

const useIdentifier = (): string => useMemo(() => nanoid(), [])

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
        script: false,
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
