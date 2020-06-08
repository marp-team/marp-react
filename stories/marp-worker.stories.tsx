import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs'
import React from 'react'
import MarpWorker from '../src/MarpWorker'
import MarpWorkerEntry from './marp.worker'

const worker = new MarpWorkerEntry()

const largeMd = (baseMd: string) => {
  let markdown = `${baseMd}\n\n---\n<!-- _color: #ccc -->\n`

  for (let i = 0; i < 100; i += 1) markdown += '\n$y=ax^2+bx+c$'
  return markdown
}

storiesOf('MarpWorker', module)
  // TODO: Stop using addon-knobs to show real-time performance without debounce
  .addDecorator(withKnobs({ escapeHTML: false }))
  .add('Basic usage', () => {
    const markdown = text(
      'Markdown',
      '# MarpWorker renderer\n\nThis renderer is using Web Worker to convert Marp Markdown.'
    )
    return <MarpWorker markdown={markdown} worker={worker} />
  })
  .add('Use worker via CDN', () => {
    const markdown = text(
      'Markdown',
      '# Use worker via CDN\n\nBy default, MarpWorker uses prebuilt worker via jsDelivr CDN.'
    )
    return <MarpWorker markdown={markdown} />
  })
  .add('Large Markdown', () => {
    const markdown = text(
      'Markdown',
      largeMd(
        [
          '# Large Markdown',
          'This deck has 100 math typesettings, but it has not blocked UI by long-time conversion.',
          'Besides, it still keeps blazing-fast preview by frame-skipped rendering. Try typing fast! :zap:',
        ].join('\n\n')
      )
    )
    return <MarpWorker markdown={markdown} worker={worker} />
  })
  .add('Custom renderer', () => {
    const markdown = text(
      'Markdown',
      largeMd(
        '# Custom renderer\n\nMarpWorker can specify initial rendering state.'
      )
    )

    return (
      <MarpWorker markdown={markdown} worker={worker}>
        {(slides) =>
          slides ? (
            slides.map(({ slide, comments }, i) => (
              <div key={i} style={{ margin: '40px' }}>
                <div style={{ boxShadow: '0 5px 10px #ccc' }}>{slide}</div>
                {comments.map((comment, ci) => (
                  <p key={ci}>{comment}</p>
                ))}
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )
        }
      </MarpWorker>
    )
  })
  .add('Multiple components', () => {
    const left = text('Left', '# :arrow_left: Left')
    const right = text('Right', '# Right :arrow_right:')

    return (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <MarpWorker markdown={left} worker={worker} />
        </div>
        <div style={{ flex: 1 }}>
          <MarpWorker markdown={right} worker={worker} />
        </div>
      </div>
    )
  })
