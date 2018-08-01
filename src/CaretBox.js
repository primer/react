import React from 'react'
import Box from './Box'
import Caret from './Caret'

export default function CaretBox(props) {
  // don't destructure these so they get passed to <Box>
  const {bg, borderColor} = props
  // destructure these ones, though, and pass the rest to <Box>
  const {caret: location, children, ...boxProps} = props
  return (
    <Box {...boxProps} bg={bg} borderColor={borderColor}>
      {children}
      <Caret borderColor={borderColor} fill={bg} location={location} />
    </Box>
  )
}

CaretBox.propTypes = {
  ...Box.propTypes,
  caret: Caret.propTypes.location
}

CaretBox.defaultProps = {
  ...Box.defaultProps,
  position: 'relative'
}
