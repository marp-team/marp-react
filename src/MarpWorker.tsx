import { MarpOptions } from '@marp-team/marp-core'
import React, { Fragment, useEffect, useState } from 'react'
import useMarpOptions from './hooks/marp-options'
import useMarpReady from './hooks/marp-ready'
import useStyle from './hooks/style'
import { stylingForComponent } from './utils/marp'
import renderToReact from './utils/render'
import { listen, send } from './utils/worker'
import { MarpRendererProps, MarpRenderedSlide } from './Marp'

export interface MarpWorkerRendererProps extends MarpRendererProps {
  children?: MarpWorkerRendererRenderProp
  render?: MarpWorkerRendererRenderProp
  worker?: Worker
}

export type MarpWorkerRendererRenderProp = (
  slides: MarpRenderedSlide[] | undefined
) => React.ReactNode

let memoizedCDNWorker: Worker | undefined

const defaultRenderer: MarpWorkerRendererRenderProp = slides =>
  slides && slides.map(({ slide }, i) => <Fragment key={i}>{slide}</Fragment>)

const CDNWorker = () => {
  if (!memoizedCDNWorker) {
    const script =
      "self.importScripts('https://cdn.jsdelivr.net/npm/@marp-team/marp-react/dist/worker.js')"
    const blob = new Blob([script], { type: 'text/javascript' })

    memoizedCDNWorker = new Worker(URL.createObjectURL(blob), {})
  }
  return memoizedCDNWorker
}

export const MarpWorker: React.FC<MarpWorkerRendererProps> = props => {
  const { children, markdown, options, render, worker } = props
  const { identifier, containerClass, marpOptions } = useMarpOptions(options)
  const renderer = render || children || defaultRenderer
  const workerInstance = worker || CDNWorker()

  const [rendered, setRendered] = useState<React.ReactNode>(renderer(undefined))
  const [style, setStyle] = useState('')
  const [queue, setQueue] = useState<[string, MarpOptions] | boolean>(false)

  useStyle(`marp-style-${identifier}`, style)
  useMarpReady()

  useEffect(
    () =>
      listen(workerInstance, {
        rendered: ({ slides, css, comments }) => {
          setRendered(
            renderer(
              slides.map((slide, i) => ({
                slide: (
                  <div className={containerClass} key={i}>
                    {renderToReact(slide)}
                  </div>
                ),
                comments: comments[i],
              }))
            )
          )
          setStyle(stylingForComponent(css, containerClass))
          setQueue(q => {
            if (q !== false && q !== true) {
              send(workerInstance, 'render', ...q)
              return true
            }
            return false
          })
        },
      }),
    [containerClass, renderer, workerInstance]
  )

  useEffect(() => {
    if (queue) {
      setQueue([markdown || '', marpOptions])
    } else {
      setQueue(true)
      send(workerInstance, 'render', markdown || '', marpOptions)
    }
  }, [markdown, options, renderer, workerInstance])

  return <>{rendered}</>
}

export default MarpWorker
