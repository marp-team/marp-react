import { MarpOptions } from '@marp-team/marp-core'
import React, { Fragment } from 'react'
import useMarpOptions from './hooks/marp-options'
import useMarp, { MarpInitializer } from './hooks/marp'
import useStyle from './hooks/style'
import { stylingForComponent } from './utils/marp'
import parse from './utils/parse'
import renderToReact from './utils/render'

export interface MarpRendererProps {
  children?: MarpRendererRenderProp
  markdown?: string
  options?: MarpOptions
  render?: MarpRendererRenderProp
  init?: MarpInitializer
}

export type MarpRendererRenderProp = (
  slides: MarpRenderedSlide[]
) => React.ReactNode

export interface MarpRenderedSlide {
  slide: React.ReactNode
  comments: string[]
}

const defaultRenderer: MarpRendererRenderProp = (slides) =>
  slides.map(({ slide }, i) => <Fragment key={i}>{slide}</Fragment>)

export const Marp: React.FC<MarpRendererProps> = (props) => {
  const { children, markdown, options, render, init } = props
  const { containerClass, identifier, marpOptions } = useMarpOptions(options)
  const marp = useMarp(marpOptions, init)

  const { html, css, comments } = marp.render(markdown || '', {
    htmlAsArray: true,
  })

  useStyle(`marp-style-${identifier}`, stylingForComponent(css, containerClass))

  const slides: MarpRenderedSlide[] = html.map((slide, i) => ({
    slide: (
      <div className={containerClass} key={i}>
        {renderToReact(parse(slide))}
      </div>
    ),
    comments: comments[i],
  }))

  return <>{(render || children || defaultRenderer)(slides)}</>
}

export default Marp
