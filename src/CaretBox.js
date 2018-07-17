import React from 'react'
import Box from './Box'
import Caret from './Caret'
import {colors} from './theme'

const bgValuesByName = colors.bg

export default function CaretBox(props) {
  const {bg, borderColor, caret: location, children, ...boxProps} = props

  const caretProps = {
    location,
    borderColor,
    fill: bgValuesByName[bg]
  }

  return (
    <Box {...boxProps} bg={bg} borderColor={borderColor}>
      {children}
      <Caret {...caretProps} />
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
