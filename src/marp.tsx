/* eslint-disable react/no-array-index-key */
import { MarpOptions } from '@marp-team/marp-core'
import React, { Fragment, useMemo } from 'react'
import { useGlobalStyle, useMarp } from './hooks'
import parse from './parser'

export type MarpRendererRenderProp = (
  slides: MarpRenderedSlide[]
) => React.ReactNode

export interface MarpRendererProps {
  children?: MarpRendererRenderProp
  markdown?: string
  options?: MarpOptions
  render?: MarpRendererRenderProp
}

interface MarpRenderedSlide {
  slide: React.ReactNode
  html: string
  comments: string[]
}

const defaultRenderer: MarpRendererRenderProp = slides => {
  const r = slides.map((ret, i) => <Fragment key={i}>{ret.slide}</Fragment>)
  return r
}

export const Marp: React.FC<MarpRendererProps> = ({
  children,
  markdown,
  options,
  render,
}) => {
  const identifier = useMemo(
    () =>
      Math.random()
        .toString(36)
        .slice(-8),
    []
  )

  const contiainerClass = `marp-${identifier}`

  const opts = useMemo(
    (): MarpOptions => ({
      ...(options || {}),
      container: false,
      markdown: {
        ...((options && options.markdown) || {}),
        xhtmlOut: true,
      },
      slideContainer: { tag: 'div', class: contiainerClass },
    }),
    [options, contiainerClass]
  )

  const marp = useMarp(opts)

  const { html, css, comments } = marp.render(markdown || '', {
    htmlAsArray: true,
  })

  useGlobalStyle(
    `marp-style-${identifier}`,
    `${css}
div.${contiainerClass}{all:initial;}
div.${contiainerClass} > svg[data-marpit-svg]{display:block;}`
  )

  const slides: MarpRenderedSlide[] = html.map((slide, i) => ({
    slide: (
      <div className={contiainerClass} key={i}>
        {parse(slide)}
      </div>
    ),
    html: slide,
    comments: comments[i],
  }))

  return <>{(render || children || defaultRenderer)(slides)}</>
}

export default Marp
