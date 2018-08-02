import React from 'react'
import Box from './Box'
import Caret from './Caret'
import {withSystemProps} from './system-props'

function CaretBox(props) {
  // don't destructure these, just grab them
  const {bg, borderColor} = props
  const {caret: location, children, ...rest} = props

  const caretProps = {
    location,
    borderColor,
    bg
  }

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

export default withSystemProps(CaretBox, ['color'])
