import { MarpOptions } from '@marp-team/marp-core'
import React, { Fragment, useEffect, useState } from 'react'
import { useGlobalStyle, useMarpOptions, useMarpReady, useMarp } from './hooks'
import parseAndRender, { render as renderParsedArray } from './parser'
import { listen, render as renderInWorker } from './worker'

export type MarpRendererRenderProp = (
  slides: MarpRenderedSlide[]
) => React.ReactNode

export interface MarpRendererProps {
  children?: MarpRendererRenderProp
  markdown?: string
  options?: MarpOptions
  render?: MarpRendererRenderProp
}

export type MarpRendererWorkerRenderProp = (
  slides: MarpRenderedSlide[] | undefined
) => React.ReactNode

export interface MarpWorkerRendererProps extends MarpRendererProps {
  children?: MarpRendererWorkerRenderProp
  render?: MarpRendererWorkerRenderProp
  worker: Worker
}

interface MarpRenderedSlide {
  slide: React.ReactNode
  html: string
  comments: string[]
}

const defaultRenderer: MarpRendererRenderProp = slides =>
  slides.map(({ slide }, i) => <Fragment key={i}>{slide}</Fragment>)

const defaultWorkerRenderer: MarpRendererWorkerRenderProp = slides =>
  slides && defaultRenderer(slides)

const stylingForComponent = (css: string, containerClass: string) => `${css}
div.${containerClass}{all:initial;}
div.${containerClass} > svg[data-marpit-svg]{display:block;}`

export const Marp: React.FC<MarpRendererProps> = props => {
  const { children, markdown, options, render } = props
  const { containerClass, identifier, marpOptions } = useMarpOptions(options)
  const marp = useMarp(marpOptions)

  const { html, css, comments } = marp.render(markdown || '', {
    htmlAsArray: true,
  })

  useGlobalStyle(
    `marp-style-${identifier}`,
    stylingForComponent(css, containerClass)
  )

  const slides: MarpRenderedSlide[] = html.map((slide, i) => ({
    slide: (
      <div className={containerClass} key={i}>
        {parseAndRender(slide)}
      </div>
    ),
    html: slide,
    comments: comments[i],
  }))

  return <>{(render || children || defaultRenderer)(slides)}</>
}

export const MarpWorker: React.FC<MarpWorkerRendererProps> = props => {
  const { children, markdown, options, render, worker } = props
  const { identifier, containerClass, marpOptions } = useMarpOptions(options)
  const renderer = render || children || defaultWorkerRenderer

  const [rendered, setRendered] = useState<React.ReactNode>(renderer(undefined))
  const [style, setStyle] = useState('')
  const [queue, setQueue] = useState<[string, MarpOptions] | boolean>(false)

  useGlobalStyle(`marp-style-${identifier}`, style)
  useMarpReady()

  useEffect(
    () =>
      listen(worker, {
        render: ({ html, css, comments }) => {
          const slides: MarpRenderedSlide[] = html.map((slide, i) => ({
            slide: (
              <div className={containerClass} key={i}>
                {renderParsedArray(slide)}
              </div>
            ),
            html: slide,
            comments: comments[i],
          }))

          setRendered(renderer(slides))
          setStyle(stylingForComponent(css, containerClass))
          setQueue(q => {
            if (q !== false && q !== true) {
              renderInWorker(worker, ...q)
              return true
            }
            return false
          })
        },
      }),
    [containerClass, renderer, worker]
  )

  useEffect(() => {
    if (queue) {
      setQueue([markdown || '', marpOptions])
    } else {
      setQueue(true)
      renderInWorker(worker, markdown || '', marpOptions)
    }
  }, [markdown, options, renderer, worker])

  return <>{rendered}</>
}

export default Marp
