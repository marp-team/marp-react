import { useLayoutEffect } from 'react'

export default function useStyle(id: string, css: string) {
  useLayoutEffect(() => {
    const style =
      document.getElementById(id) ||
      (() => {
        const element = document.createElement('style')

        element.id = id
        document.head.appendChild(element)

        return element
      })()

    return () => style.remove()
  }, [id])

  useLayoutEffect(() => {
    const style = document.getElementById(id)
    if (style) style.textContent = css
  }, [id, css])
}
