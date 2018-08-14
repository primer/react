import React from 'react'
import BorderBox from './BorderBox'
import {Position} from './Position'
import Caret from './Caret'

function PointerBox(props) {
  // don't destructure these, just grab them
  const {bg, border, borderColor} = props
  const {caret, children, ...boxProps} = props
  const caretProps = {bg, borderColor, borderWidth: border, location: caret}
  return (
    <Position {...boxProps}>
      {children}
      <Caret {...caretProps} />
    </Position>
  )
}

PointerBox.propTypes = {
  ...Position.propTypes,
  caret: Caret.propTypes.location
}

PointerBox.defaultProps = {
  ...BorderBox.defaultProps,
  position: 'relative'
}

// we can set this because it "extends" Position implicitly
PointerBox.systemComponent = true

export default PointerBox
