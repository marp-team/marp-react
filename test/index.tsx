import { EventEmitter } from 'events'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Marp, MarpWorker, MarpWorkerRendererProps } from '../src/index'
import initializeWorker from '../src/worker'

interface WorkerMock extends Worker, EventEmitter {
  interrupt: (state?: boolean) => void
  postQueue: jest.Mock
  queue: any[]
}

beforeEach(() => {
  jest.clearAllMocks()

  document.head.innerHTML = ''
  document.body.innerHTML = ''
})

describe('Marp', () => {
  it('renders passed Markdown', () => {
    const marp = mount(<Marp markdown="# Hello" />)
    expect(marp.find('section > h1')).toHaveLength(1)

    const markdown = `
---
theme: gaia
class: lead
---

![bg](bg.png)

# Marp Markdown
    `.trim()

    marp.setProps({ markdown })
    expect(marp.find('section.lead')).not.toHaveLength(0)
    expect(marp.find('figure')).toHaveLength(1)
  })

  it('renders highlighted fence correctly', () => {
    const markdown = `
\`\`\`js
test({
  foo: 0,
  bar: 1,
});
\`\`\`
`.trim()

    const marp = mount(<Marp markdown={markdown} />)
    expect(
      marp
        .text()
        .replace(/!function.*;/, '')
        .trim()
    ).toBe(
      `
test({
  foo: 0,
  bar: 1,
});
`.trim()
    )
  })

  it('injects global style for rendering Marp slide', () => {
    mount(<Marp />)
    expect(document.head.querySelector('style[id^="marp-style"]')).toBeTruthy()
  })

  it('removes injected style when unmounted', () => {
    const marp = mount(<Marp />)
    marp.unmount()

    expect(document.head.querySelector('style[id^="marp-style"]')).toBeFalsy()
  })

  describe('Custom renderer', () => {
    const markdown = '<!--comment-->'
    const renderer = jest.fn(() => <p>rendered</p>)

    it('allows custom renderer passed by render prop', () => {
      const marp = mount(<Marp markdown={markdown} render={renderer} />)
      expect(marp.find('p').text()).toBe('rendered')

      expect(renderer).toBeCalledWith([
        expect.objectContaining({
          slide: expect.anything(),
          comments: ['comment'],
        }),
      ])
    })

    it('allows custom renderer passed by children', () => {
      const marp = mount(<Marp markdown={markdown}>{renderer}</Marp>)
      expect(marp.find('p').text()).toBe('rendered')

      expect(renderer).toBeCalledWith([
        expect.objectContaining({
          slide: expect.anything(),
          comments: ['comment'],
        }),
      ])
    })
  })
})

describe('MarpWorker', () => {
  const Worker = jest.fn(() => {
    const wk: any = new EventEmitter()

    Object.assign(wk, {
      // Queueing for test
      queue: [],
      interrupted: false,
      interrupt: (state = true) => {
        if (!state) while (wk.queue.length > 0) wk.postQueue(wk.queue.shift())
        wk.interrupted = state
      },

      // Event emitter functions
      addEventListener: (e, listener) => wk.addListener(e, listener),
      removeEventListener: (e, listener) => wk.removeListener(e, listener),
      postMessage: m => (wk.interrupted ? wk.queue.push(m) : wk.postQueue(m)),
      postQueue: jest.fn(data => wk.emit('message', { data })),
    })

    initializeWorker(wk)
    return wk as WorkerMock
  })

  const marpWorker = (
    props: MarpWorkerRendererProps
  ): ReactWrapper<MarpWorkerRendererProps> => {
    let mounted

    act(() => {
      mounted = mount(<MarpWorker {...props} />) // eslint-disable-line react/jsx-props-no-spreading
    })

    return mounted.update()
  }

  it('renders passed Markdown', () => {
    const marp = marpWorker({ worker: new Worker(), markdown: '# Test' })
    expect(marp.find('section > h1')).toHaveLength(1)

    // Track change of markdown prop
    act(() => {
      marp.setProps({ markdown: '## Hello' })
    })

    marp.update()
    expect(marp.find('section > h1')).toHaveLength(0)
    expect(marp.find('section > h2')).toHaveLength(1)
  })

  it('removes listener for worker when unmounted', () => {
    const worker = new Worker()
    const marp = marpWorker({ worker })

    expect(worker.listeners('message')).toHaveLength(2) // Worker + component

    marp.unmount()
    expect(worker.listeners('message')).toHaveLength(1) // component only
  })

  it('queues new rendering while converting', () => {
    const worker = new Worker()
    const marp = marpWorker({ worker })

    worker.interrupt()
    act(() => {
      marp.setProps({ markdown: '1' })
    })
    act(() => {
      marp.setProps({ markdown: '2' })
    })
    act(() => {
      marp.setProps({ markdown: '3' })
    })
    expect(worker.queue).toHaveLength(1)

    act(() => {
      worker.interrupt(false)
    })
    expect(
      marp
        .text()
        .replace(/!function.*;/, '')
        .trim()
    ).toBe('3')

    // 2nd rendering will be skipped
    expect(worker.postQueue).not.toBeCalledWith(expect.arrayContaining(['2']))
  })
})
