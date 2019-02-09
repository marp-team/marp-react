import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs'
import React from 'react'
import { Marp } from '../src/index'

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
