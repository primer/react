import React from 'react'
import PropTypes from 'prop-types'
import theme from './theme'

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

function getPosition({edge, align}) {
  const opposite = oppositeEdge[edge].toLowerCase()
  const perp = perpendicularEdge[edge].toLowerCase()
  return {
    [opposite]: '100%',
    [perp]: '50%'
  }
}

export default function Caret({css, ...rest}) {
  // TODO: should the svg switch even be configurable,
  // or do we use feature detection here?
  return css
    ? <CaretCSS {...rest} />
    : <CaretSVG {...rest} />
}

Caret.defaultProps = {
  align: 'center',
  borderColor: theme.colors.gray[2],
  borderWidth: 1,
  edge: 'bottom',
  fill: theme.colors.white,
  position: 'absolute',
  size: 8,
  css: false
}

Caret.propTypes = {
  align: PropTypes.oneOf(['start', 'center', 'end']),
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
  edge: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  fill: PropTypes.string,
  position: PropTypes.oneOf(['absolute', 'relative']),
  size: PropTypes.number,
  css: PropTypes.bool
}

function CaretCSS(props) {
  const {
    align,
    borderColor,
    borderWidth,
    edge,
    fill,
    position,
    size
  } = props

  const opposite = oppositeEdge[edge]
  const perp = perpendicularEdge[edge]

  const style = {
    pointerEvents: 'none',
    position,
    ...getPosition({edge, align})
  }

  const common = {
    borderStyle: 'solid',
    borderWidth,
    position: 'absolute',
    [opposite.toLowerCase()]: '100%',
  }

  const after = {
    ...common,
    borderColor: 'transparent',
    borderWidth: size,
    [`border${opposite}Color`]: fill,
    [`margin${perp}`]: -size
  }

  const before = {
    ...common,
    borderColor: 'transparent',
    [`border${opposite}Color`]: borderColor,
    borderWidth: borderWidth + size,
    [`margin${perp}`]: -(size + borderWidth)
  }

  return (
    <div style={style}>
      <div style={before} />
      <div style={after} />
    </div>
  )
}

function CaretSVG(props) {
  const {
    align,
    borderColor,
    borderWidth,
    edge,
    fill,
    position,
    size
  } = props

  const perp = perpendicularEdge[edge]

  const style = {
    pointerEvents: 'none',
    position,
    ...getPosition({edge, align}),
    [`margin${perp}`]: -size
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
        <path d={triangle} fill={fill} />
        <path d={line}
          fill='none'
          stroke={borderColor}
          strokeWidth={borderWidth} />
      </g>
    </svg>
  )
}
