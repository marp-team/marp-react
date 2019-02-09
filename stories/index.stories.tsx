// import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { storiesOf } from '@storybook/react'
import { Welcome } from '@storybook/react/demo'
import React from 'react'
import Hello from '../src/index'

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Index')} />
))

storiesOf('Index', module).add('Hello world', () => <Hello />)
