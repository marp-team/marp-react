export const stylingForComponent = (
  css: string,
  containerClass: string
) => `${css}
div.${containerClass}{all:initial;}
div.${containerClass} > svg[data-marpit-svg]{display:block;will-change:transform;}`
