import { Marp, MarpOptions } from '@marp-team/marp-core'
import { useMemo } from 'react'
import useMarpReady from './marp-ready'

export type MarpInitializer = (marp: Marp) => Marp

export default function useMarp(
  opts: MarpOptions = {},
  init: MarpInitializer = marp => marp
): Marp {
  useMarpReady()
  return useMemo(() => (init ? init(new Marp(opts)) : new Marp(opts)), [
    opts,
    init,
  ])
}
