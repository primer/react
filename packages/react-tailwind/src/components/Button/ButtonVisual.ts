import React from 'react'

export type ButtonVisual = React.ReactElement | React.ElementType | null

export function resolveButtonVisual(visual: ButtonVisual) {
  return React.isValidElement(visual) ? visual : visual ? React.createElement(visual) : null
}
