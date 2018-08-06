import React from 'react'
import Box from './Box'
import Caret from './Caret'

function CaretBox({position, ...rest}) {
  // don't destructure these, just grab them
  const {bg, border, borderColor} = rest
  const {caret, children, ...boxProps} = rest
  const caretProps = {bg, borderColor, borderWidth: border, location: caret}
  return (
    <Box {...boxProps} css={{position}}>
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

// we can set this because it "extends" Box implicitly
CaretBox.systemComponent = true

export default CaretBox
