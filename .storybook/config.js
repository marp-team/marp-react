import { configure } from '@storybook/react'

// automatically import all files ending in *.stories.js[x]
const req = require.context('../stories', true, /.stories.[jt]sx?$/)

configure(() => req.keys().forEach(fn => req(fn)), module)
