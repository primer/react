import React from 'react'
import PropTypes from 'prop-types'
import {themeGet} from 'styled-system'

const oppositeEdge = {
  top: 'Bottom',
  right: 'Left',
  bottom: 'Top',
  left: 'Right'
}

const perpendicularEdge = {
  top: 'Left',
  right: 'Top',
  bottom: 'Left',
  left: 'Top'
}

export default function Caret(props) {
  const {bg: bgKey, borderColor: borderColorKey, borderWidth: borderWidthKey, location, size: sizeKey} = props

  const bg = themeGet(`colors.${bgKey}`, '#fff')(props)
  const borderColor = themeGet(`colors.${borderColorKey}`, '#000')(props)
  const borderWidth = themeGet(`borderWidths.${borderWidthKey}`, 1)(props)
  const size = themeGet(`space.${sizeKey}`, 8)(props)

  const [edge, align] = getEdgeAlign(location)
  const perp = perpendicularEdge[edge]

  const style = {
    pointerEvents: 'none',
    position: 'absolute',
    ...getPosition(edge, align, size),
    // if align is set (top|right|bottom|left),
    // then we don't need an offset margin
    [`margin${perp}`]: align ? null : -size
  }

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
    left: `translate(${[size * 2, size]}) rotate(90)`
  }[edge]

  return (
    <svg width={size * 2} height={size * 2} style={style}>
      <g transform={transform}>
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
  'left-bottom'
]

Caret.defaultProps = {
  bg: 'white',
  borderWidth: 1,
  borderColor: 'gray.2',
  location: 'bottom',
  size: 8
}

Caret.propTypes = {
  bg: PropTypes.string,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
  location: PropTypes.oneOf(Caret.locations),
  size: PropTypes.number
}

function getEdgeAlign(location) {
  const [edge, align] = location.split('-')
  return [edge, align]
}

function getPosition(edge, align, spacing) {
  const opposite = oppositeEdge[edge].toLowerCase()
  const perp = perpendicularEdge[edge].toLowerCase()
  return {
    [opposite]: '100%',
    [align || perp]: align ? spacing : '50%'
  }
}
