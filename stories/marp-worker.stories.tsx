import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs'
import React from 'react'
import Worker from './marp.worker'
import { MarpWorker } from '../src/index'

const worker = new Worker()

storiesOf('MarpWorker', module)
  .addDecorator(withKnobs({ escapeHTML: false }))
  .add('Basic usage', () => (
    <MarpWorker
      worker={worker}
      markdown={text('Markdown', '# Hello, world!')}
    />
  ))
  .add('Multiple slides', () => (
    <MarpWorker
      worker={worker}
      markdown={text('Markdown', '# Page 1\n\n---\n\n# Page 2')}
    />
  ))
  .add('Theme support', () => (
    <MarpWorker
      worker={worker}
      markdown={text('Markdown', '<!-- theme: gaia -->\n\n# Theme support')}
    />
  ))
  .add('Custom renderer', () => (
    <MarpWorker
      worker={worker}
      markdown={text(
        'Markdown',
        '# Page 1\n\n<!-- Comment (for presenter notes) -->\n\n---\n\n![bg](#fff8f0)\n\n# Page 2'
      )}
    >
      {slides =>
        slides.map(({ slide, comments }, i) => (
          <div key={i} style={{ margin: '40px' }}>
            <div style={{ boxShadow: '0 5px 10px #ccc' }}>{slide}</div>
            {comments.map((comment, ci) => (
              <p key={ci}>{comment}</p>
            ))}
          </div>
        ))
      }
    </MarpWorker>
  ))
