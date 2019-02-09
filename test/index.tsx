import { shallow } from 'enzyme'
import React from 'react'
import Hello from '../src/index'

describe('Hello', () => {
  it('renders button', () => {
    const hello = shallow(<Hello />)
    expect(hello.find('button')).toHaveLength(1)
  })
})
