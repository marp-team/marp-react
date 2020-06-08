import { configure } from '@storybook/react'

const req = require.context('../stories', true, /.stories.[jt]sx?$/)

configure(() => req.keys().forEach((fn) => req(fn)), module)
