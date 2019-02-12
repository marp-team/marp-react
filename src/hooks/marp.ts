import { Marp, MarpOptions } from '@marp-team/marp-core'
import { useMemo } from 'react'
import useMarpReady from './marp-ready'

export default function useMarp(opts: MarpOptions = {}): Marp {
  useMarpReady()
  return useMemo(() => new Marp(opts), [opts])
}
