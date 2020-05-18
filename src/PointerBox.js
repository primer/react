import React from 'react'
import PropTypes from 'prop-types'
import BorderBox from './BorderBox'
import Caret from './Caret'
import theme from './theme'

function PointerBox(props) {
  // don't destructure these, just grab them so that they are applied to the caret and the BorderBox
  const {bg, borderColor, borderWidth, borderStyle} = props
  const {caret, children, ...boxProps} = props
  const caretProps = {bg, borderColor, borderWidth, borderStyle, location: caret}
  return (
    <BorderBox sx={{position: 'relative'}} {...boxProps}>
      {children}
      <Caret {...caretProps} />
    </BorderBox>
  )
}

PointerBox.defaultProps = {
  theme
}

PointerBox.propTypes = {
  ...BorderBox.propTypes,
  caret: Caret.propTypes.location,
  theme: PropTypes.object
}

export default PointerBox
