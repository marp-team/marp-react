import EventEmitter from 'events'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Marp, MarpWorker } from '../src/index'
import { MarpWorkerRendererProps } from '../src/marp'
import initializeWorker from '../src/worker'

beforeEach(() => {
  jest.clearAllMocks()

  document.head.innerHTML = ''
  document.body.innerHTML = ''
})

describe('Marp', () => {
  it('renders passed Markdown', () => {
    const marp = mount(<Marp markdown="# Hello" />)
    expect(marp.find('section > h1')).toHaveLength(1)
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
          html: expect.stringContaining('section'),
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
          html: expect.stringContaining('section'),
          comments: ['comment'],
        }),
      ])
    })
  })
})

describe('MarpWorker', () => {
  const Worker = jest.fn(() => {
    const wk = new EventEmitter()

    Object.assign(wk, {
      addEventListener: (e, listener) => wk.addListener(e, listener),
      removeEventListener: (e, listener) => wk.removeListener(e, listener),
      postMessage: message => wk.emit('message', { data: message }),
    })

    initializeWorker(wk as any)
    return wk as Worker & EventEmitter
  })

  const marpWorker = (
    props: MarpWorkerRendererProps
  ): ReactWrapper<MarpWorkerRendererProps> => {
    let mounted

    act(() => {
      mounted = mount(<MarpWorker {...props} />)
    })

    return mounted.update()
  }

  it('renders passed Markdown', () => {
    const worker = new Worker()

    const marp = marpWorker({ worker, markdown: '# Test' })
    expect(marp.find('section > h1')).toHaveLength(1)

    // Track change of markdown prop
    act(() => {
      marp.setProps({ markdown: '## Hello' })
    })

    marp.update()
    expect(marp.find('section > h1')).toHaveLength(0)
    expect(marp.find('section > h2')).toHaveLength(1)
  })
})
