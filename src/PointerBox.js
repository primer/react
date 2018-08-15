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
    <BorderBox {...boxProps} css={{position: 'relative'}}>
      {children}
      <Caret {...caretProps} />
    </BorderBox>
  )
}

PointerBox.propTypes = {
  ...BorderBox.propTypes,
  caret: Caret.propTypes.location
}

// we can set this because it "extends" Box implicitly
PointerBox.systemComponent = true

export default PointerBox
