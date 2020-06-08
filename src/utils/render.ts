import { createElement } from 'react'

export default function render(parsed) {
  if (typeof parsed === 'string') return parsed
  if (!Array.isArray(parsed[2])) return JSON.stringify(parsed)
  return createElement(parsed[0], parsed[1], ...parsed[2].map((c) => render(c)))
}
