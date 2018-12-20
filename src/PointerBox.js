import React from 'react'
import PropTypes from 'prop-types'
import BorderBox from './BorderBox'
import Caret from './Caret'
import theme from './theme'

function PointerBox(props) {
  // don't destructure these, just grab them
  const {bg, border, borderColor} = props
  const {caret, children, ...boxProps} = props
  const caretProps = {bg, borderColor, borderWidth: border, location: caret}
  return (
    <BorderBox {...boxProps} css={{position: 'relative'}}>
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
