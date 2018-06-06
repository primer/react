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

export default function Caret(props) {
  const {
    align,
    borderColor,
    borderWidth,
    edge,
    fill,
    position,
    size
  } = props

  const borderStyle = 'solid'
  const opposite = oppositeEdge[edge]
  const perp = perpendicularEdge[edge]

  const style = {
    pointerEvents: 'none',
    position,
    ...getPosition({edge, align})
  }

  const common = {
    borderStyle,
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

Caret.defaultProps = {
  align: 'center',
  borderColor: theme.colors.gray[3],
  borderWidth: 1,
  edge: 'bottom',
  fill: theme.colors.white,
  position: 'absolute',
  size: 8,
}

Caret.propTypes = {
  align: PropTypes.oneOf(['start', 'center', 'end']),
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
  edge: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  fill: PropTypes.string,
  position: PropTypes.oneOf(['absolute', 'relative']),
  size: PropTypes.number
}
