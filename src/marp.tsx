import { MarpOptions } from '@marp-team/marp-core'
import React, { Fragment, useEffect, useState } from 'react'
import { useStyle, useMarpOptions, useMarpReady, useMarp } from './utils/hooks'
import * as parser from './utils/parser'
import { listen, send } from './utils/worker'

export type MarpRendererRenderProp = (
  slides: MarpRenderedSlide[]
) => React.ReactNode

export interface MarpRendererProps {
  children?: MarpRendererRenderProp
  markdown?: string
  options?: MarpOptions
  render?: MarpRendererRenderProp
}

export type MarpWorkerRendererRenderProp = (
  slides: MarpRenderedSlide[] | undefined
) => React.ReactNode

export interface MarpWorkerRendererProps extends MarpRendererProps {
  children?: MarpWorkerRendererRenderProp
  render?: MarpWorkerRendererRenderProp
  worker: Worker
}

interface MarpRenderedSlide {
  slide: React.ReactNode
  comments: string[]
}

const defaultRenderer: MarpRendererRenderProp = slides =>
  slides.map(({ slide }, i) => <Fragment key={i}>{slide}</Fragment>)

const defaultWorkerRenderer: MarpWorkerRendererRenderProp = slides =>
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

  useStyle(`marp-style-${identifier}`, stylingForComponent(css, containerClass))

  const slides: MarpRenderedSlide[] = html.map((slide, i) => ({
    slide: (
      <div className={containerClass} key={i}>
        {parser.render(parser.parse(slide))}
      </div>
    ),
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

  useStyle(`marp-style-${identifier}`, style)
  useMarpReady()

  useEffect(
    () =>
      listen(worker, {
        rendered: ({ slides, css, comments }) => {
          setRendered(
            renderer(
              slides.map((slide, i) => ({
                slide: (
                  <div className={containerClass} key={i}>
                    {parser.render(slide)}
                  </div>
                ),
                comments: comments[i],
              }))
            )
          )
          setStyle(stylingForComponent(css, containerClass))
          setQueue(q => {
            if (q !== false && q !== true) {
              send(worker, 'render', ...q)
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
      send(worker, 'render', markdown || '', marpOptions)
    }
  }, [markdown, options, renderer, worker])

  return <>{rendered}</>
}
