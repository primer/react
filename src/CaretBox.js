import React from 'react'
import Box from './Box'
import Caret from './Caret'

function CaretBox(props) {
  // don't destructure these, just grab them
  const {bg, borderColor} = props
  const {caret, children, ...rest} = props
  const caretProps = {bg, borderColor, location: caret}
  return (
    <Box {...rest}>
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

// we can set this because it "inherits" all of Box's system props
CaretBox.systemComponent = true

export default CaretBox
