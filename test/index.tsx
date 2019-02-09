import { shallow } from 'enzyme'
import React from 'react'
import Marp from '../src/index'

describe('Marp', () => {
  it('renders passed Markdown', () => {
    const marp = shallow(<Marp markdown="# Hello" />)
    expect(marp.find('h1')).toHaveLength(1)
  })
})
