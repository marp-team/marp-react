import camelCase from 'camelcase'
import { decode } from 'he'
import htm from 'htm'
import styleToObject from 'style-to-object'

const decodeEntities = <V>(v: V, isAttributeValue = false) =>
  typeof v === 'string' ? decode(v, { isAttributeValue }) : v

const html = htm.bind((type: string, props, ...children) => {
  const newProps = { ...props }

  // Decode HTML entities in arguments
  Object.keys(newProps).forEach((p) => {
    newProps[p] = decodeEntities(newProps[p], true)
  })

  // React prefer class to className
  if (newProps.class !== undefined) {
    newProps.className = newProps.class
    delete newProps.class
  }

  // Use object style instead of inline style
  if (newProps.style !== undefined) {
    const objStyle = {}
    styleToObject(newProps.style, (propName, propValue) => {
      if (propName && propValue) objStyle[camelCase(propName)] = propValue
    })
    newProps.style = objStyle
  }

  return [type, newProps, children.map((c) => decodeEntities(c))]
})

export default function parse(htmlStr: string) {
  const lines = htmlStr.split('\n')
  const breaks = [...Array(lines.length - 1)].map(() => '\n')

  try {
    return html((lines as any) as TemplateStringsArray, ...breaks)
  } catch (e) {
    return `Could not parse the given HTML text. Please check whether there are missing closing tags. (detailed error message: ${e})`
  }
}
