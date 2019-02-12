import MarpReady from '@marp-team/marp-core/lib/browser.cjs'
import { useLayoutEffect } from 'react'

const marpReadySymbol = Symbol('MarpReactReady')

export default function useMarpReady() {
  useLayoutEffect(() => {
    if (!window || window[marpReadySymbol]) return

    window[marpReadySymbol] = true
    MarpReady()
  }, [])
}
