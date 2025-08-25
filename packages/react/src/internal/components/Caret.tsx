import React from 'react'
import {ThemeContext} from 'styled-components'
import {style} from 'styled-system'
import type {Theme} from '../../ThemeProvider'

type Location =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'right'
  | 'right-top'
  | 'right-bottom'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'left-top'
  | 'left-bottom'

type Alignment = 'top' | 'right' | 'bottom' | 'left'

const oppositeEdge = {
  top: 'Bottom',
  right: 'Left',
  bottom: 'Top',
  left: 'Right',
}

const perpendicularEdge = {
  top: 'Left',
  right: 'Top',
  bottom: 'Left',
  left: 'Top',
}

function getEdgeAlign(location: Location) {
  const [edge, align] = location.split('-')
  return [edge as Alignment, align as Alignment | undefined] as const
}

function getPosition(edge: Alignment, align: Alignment | undefined, spacing: number) {
  const opposite = oppositeEdge[edge].toLowerCase()
  const perp = perpendicularEdge[edge].toLowerCase()
  return {
    [opposite]: '100%',
    [align || perp]: align ? spacing : '50%',
  }
}

const getBg = style({prop: 'bg', key: 'colors'})
const getBorderColor = style({prop: 'borderColor', key: 'colors'})
const getBorderWidth = style({prop: 'borderWidth', key: 'borderWidths', scale: [0, 1]})

export type CaretProps = {
  bg?: string
  borderColor?: string
  borderWidth?: string | number
  size?: number
  location?: Location
  theme?: Theme
}

function Caret(props: CaretProps) {
  const theme = React.useContext(ThemeContext)
  const propsWithTheme = {
    ...props,
    bg: props.bg || 'canvas.default',
    borderColor: props.borderColor || 'border.default',
    borderWidth: props.borderWidth || 1,
    theme: props.theme ?? theme,
  }
  const {bg} = getBg(propsWithTheme)
  const {borderColor} = getBorderColor(propsWithTheme)
  const {borderWidth} = getBorderWidth(propsWithTheme)
  const {size = 8, location = 'bottom'} = props
  const [edge, align] = getEdgeAlign(location)
  const perp = perpendicularEdge[edge]

  // note: these arrays represent points in the form [x, y]
  const a = [-size, 0]
  const b = [0, size]
  const c = [size, 0]

  // spaces are optional in path `d` attribute, and points are
  // represented in the form `x,y` -- which is what the arrays above
  // become when stringified!
  const triangle = `M${a}L${b}L${c}L${a}Z`
  const line = `M${a}L${b}L${c}`

  const transform = {
    top: `translate(${[size, size * 2]}) rotate(180)`,
    right: `translate(${[0, size]}) rotate(-90)`,
    bottom: `translate(${[size, 0]})`,
    left: `translate(${[size * 2, size]}) rotate(90)`,
  }[edge]

  return (
    <svg
      width={size * 2}
      height={size * 2}
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        ...getPosition(edge, align, size),
        // if align is set (top|right|bottom|left),
        // then we don't need an offset margin
        [`margin${perp}`]: align ? null : -size,
      }}
      role="presentation"
    >
      <g transform={transform}>
        <path d={triangle} fill={theme?.colors.canvas.default} />
        <path d={triangle} fill={bg} />
        <path d={line} fill="none" stroke={borderColor} strokeWidth={borderWidth} />
      </g>
    </svg>
  )
}

Caret.locations = [
  'top',
  'top-left',
  'top-right',
  'right',
  'right-top',
  'right-bottom',
  'bottom',
  'bottom-left',
  'bottom-right',
  'left',
  'left-top',
  'left-bottom',
]

export default Caret
