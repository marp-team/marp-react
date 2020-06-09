import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs'
import React from 'react'
import markdownItContainer from 'markdown-it-container'
import Marp from '../src/Marp'

storiesOf('Marp', module)
  .addDecorator(withKnobs({ escapeHTML: false }))
  .add('Basic usage', () => (
    <Marp markdown={text('Markdown', '# Hello, world!')} />
  ))
  .add('Multiple slides', () => (
    <Marp markdown={text('Markdown', '# Page 1\n\n---\n\n# Page 2')} />
  ))
  .add('Theme support', () => (
    <Marp
      markdown={text('Markdown', '<!-- theme: gaia -->\n\n# Theme support')}
    />
  ))
  .add('Custom renderer', () => (
    <Marp
      markdown={text(
        'Markdown',
        '# Page 1\n\n<!-- Comment (for presenter notes) -->\n\n---\n\n![bg](#fff8f0)\n\n# Page 2'
      )}
    >
      {(slides) =>
        slides.map(({ slide, comments }, i) => (
          <div key={i} style={{ margin: '40px' }}>
            <div style={{ boxShadow: '0 5px 10px #ccc' }}>{slide}</div>
            {comments.map((comment, ci) => (
              <p key={ci}>{comment}</p>
            ))}
          </div>
        ))
      }
    </Marp>
  ))
  .add('markdown-it plugin support', () => (
    <Marp
      markdown={text(
        'Markdown',
        `
::: columns
The delimiter \`:::\` should not be shown here.
:::
      `.trim()
      )}
      init={(marp) => marp.use(markdownItContainer, 'columns')}
    />
  ))
  .add('Broken tag (no close)', () => (
    <Marp
      options={{
        html: true,
        markdown: {
          breaks: true,
        },
      }}
      markdown={text('Markdown', `<div>aaa`)}
    />
  ))
  .add('Broken tag (no open)', () => (
    <Marp
      options={{
        html: true,
        markdown: {
          breaks: true,
        },
      }}
      markdown={text('Markdown', `aaa</div>`)}
    />
  ))
