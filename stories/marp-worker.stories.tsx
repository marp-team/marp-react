import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'
import Worker from './marp.worker'
import { MarpWorker } from '../src/index'

const worker = new Worker()

const Editor: React.FC<{
  children: (buffer: string) => any
  markdown?: string
}> = props => {
  const { children, markdown } = props
  const [buffer, setBuffer] = useState(markdown || '')
  const handleChange = e => setBuffer(e.target.value)

  return (
    <div style={{ display: 'flex', height: '500px' }}>
      <textarea value={buffer} onChange={handleChange} style={{ flex: 1 }} />
      <div style={{ flex: 1, overflowY: 'auto' }}>{children(buffer)}</div>
    </div>
  )
}

storiesOf('MarpWorker', module)
  .add('Basic usage', () => (
    <Editor
      markdown={`
# MarpWorker renderer

This renderer is using Web Worker to convert Marp Markdown.
    `.trim()}
    >
      {markdown => <MarpWorker markdown={markdown} worker={worker} />}
    </Editor>
  ))
  .add('Too large markdown', () => {
    let markdown = `# Too large markdown

This deck has 200 math typesettings, but it has not blocked UI by conversion.

Besides, it still keeps blazing-fast preview by frame-skipped rendering. Try typing fast!

---
<!-- _color: #ddd -->
`
    for (let i = 0; i < 200; i += 1) markdown += '\n$y=ax^2+bx+c$'

    return (
      <Editor markdown={markdown}>
        {markdown => <MarpWorker markdown={markdown} worker={worker} />}
      </Editor>
    )
  })
