import React from 'react'
import Position from './Position'
import Caret from './Caret'

function CaretBox(props) {
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

CaretBox.propTypes = {
  ...Position.propTypes,
  caret: Caret.propTypes.location
}

CaretBox.defaultProps = {
  ...Position.defaultProps,
  bg: 'white',
  border: 1,
  borderColor: 'gray.2',
  borderRadius: 1,
  position: 'relative'
}

// we can set this because it "extends" Position implicitly
CaretBox.systemComponent = true

export default CaretBox
