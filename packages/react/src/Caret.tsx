import React from 'react'
import classes from './Caret.module.css'

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

export type CaretProps = {
  bg?: string
  borderColor?: string
  borderWidth?: string | number
  size?: number
  location?: Location
}

function Caret(props: CaretProps) {
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
      className={classes.Caret}
      style={{
        ...getPosition(edge, align, size),
        // if align is set (top|right|bottom|left),
        // then we don't need an offset margin
        [`margin${perp}`]: align ? null : -size,
      }}
      role="presentation"
    >
      <g transform={transform}>
        <path d={triangle} className={classes.Background} />
        <path d={triangle} style={{fill: props.bg}} className={classes.Background} />
        <path
          d={line}
          fill="none"
          style={{
            stroke: props.borderColor,
            strokeWidth: props.borderWidth,
          }}
          className={classes.Border}
        />
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
