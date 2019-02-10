import { MarpOptions } from '@marp-team/marp-core'
import React, { Fragment, useMemo } from 'react'
import { useGlobalStyle, useIdentifier, useMarp } from './hooks'
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

const defaultRenderer: MarpRendererRenderProp = slides =>
  slides.map(({ slide }, i) => <Fragment key={i}>{slide}</Fragment>)

export const Marp: React.FC<MarpRendererProps> = props => {
  const { children, markdown, options, render } = props

  const identifier = useIdentifier()
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

  const { html, css, comments } = useMarp(opts).render(markdown || '', {
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
