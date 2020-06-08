import { createElement } from 'react'

export default function render(parsed) {
  return typeof parsed === 'string'
    ? parsed
    : createElement(parsed[0], parsed[1], ...parsed[2].map((c) => render(c)))
}
