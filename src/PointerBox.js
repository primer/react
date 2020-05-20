import React from 'react'
import PropTypes from 'prop-types'
import BorderBox from './BorderBox'
import Caret from './Caret'
import theme from './theme'
import {useDeprecation} from  './utils/deprecate'

function PointerBox(props) {
  // don't destructure these, just grab them
  const {bg, borderColor, borderWidth, borderStyle} = props
  const {caret, children, ...boxProps} = props
  const caretProps = {bg, borderColor, borderWidth, borderStyle, location: caret}
  useDeprecation({
    name: 'PointerBox',
    version: '21.0.0',
    message: 'Use the Popover component instead. See https://primer.style/components/Popover for more details.'
  })
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
