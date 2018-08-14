import React from 'react'
import BorderBox from './BorderBox'
import Caret from './Caret'

function CaretBox({position, ...rest}) {
  // don't destructure these, just grab them
  const {bg, border, borderColor} = rest
  const {caret, children, ...boxProps} = rest
  const caretProps = {bg, borderColor, borderWidth: border, location: caret}
  return (
    <BorderBox {...boxProps} css={{position}}>
      {children}
      <Caret {...caretProps} />
    </BorderBox>
  )
}

CaretBox.propTypes = {
  ...BorderBox.propTypes,
  caret: Caret.propTypes.location
}

CaretBox.defaultProps = {
  ...BorderBox.defaultProps,
  position: 'relative'
}

// we can set this because it "extends" Box implicitly
CaretBox.systemComponent = true

export default CaretBox
