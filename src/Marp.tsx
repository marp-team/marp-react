import { MarpOptions } from '@marp-team/marp-core'
import React, { Fragment } from 'react'
import { useStyle, useMarpOptions, useMarp } from './utils/hooks'
import { stylingForComponent } from './utils/marp'
import * as parser from './utils/parser'

export interface MarpRendererProps {
  children?: MarpRendererRenderProp
  markdown?: string
  options?: MarpOptions
  render?: MarpRendererRenderProp
}

export type MarpRendererRenderProp = (
  slides: MarpRenderedSlide[]
) => React.ReactNode

export interface MarpRenderedSlide {
  slide: React.ReactNode
  comments: string[]
}

export const defaultRenderer: MarpRendererRenderProp = slides =>
  slides.map(({ slide }, i) => <Fragment key={i}>{slide}</Fragment>)

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

export default Marp
