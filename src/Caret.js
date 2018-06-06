import React from 'react'
import PropTypes from 'prop-types'
import theme from './theme'

const oppositeEdge = {
  top: 'Bottom',
  right: 'Left',
  bottom: 'Top',
  left: 'Right'
}

function getPosition({edge, align}) {
  return {
    top: '100%',
    left: '50%'
  }
}

function getOffset({edge, align, size}) {
  return {
    marginLeft: -size,
  }
}

export default function Caret(props) {
  const {
    align = 'center',
    borderColor = 'black',
    borderWidth = 1,
    edge = 'bottom',
    fill = 'white',
    position = 'absolute',
    size = 8
  } = props
  
  const borderStyle = 'solid'
  const opposite = oppositeEdge[edge]

  const style = {
    position,
    ...getPosition({edge, align})
  }

  const common = {
    borderStyle,
    borderWidth,
    height: 0,
    width: 0,
    position: 'absolute',
    pointerEvents: 'none'
  }

  const after = {
    ...common,
    borderColor: 'transparent',
    borderWidth: size,
    [`border${opposite}Color`]: fill,
    ...getOffset({edge, align, size})
  }

  const before = {
    ...common,
    borderColor: 'transparent',
    [`border${opposite}Color`]: borderColor,
    borderWidth: borderWidth + size,
    ...getOffset({edge, align, size: size + borderWidth})
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
