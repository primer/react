import React from 'react'
import BorderBox, {BorderBoxProps} from './BorderBox'
import Caret, {CaretProps} from './Caret'
import {ForwardRefComponent} from './utils/polymorphic'

const defaultElement = 'div'

export type PointerBoxProps = {
  caret?: CaretProps['location']
  bg?: CaretProps['bg']
  borderColor?: CaretProps['borderColor']
  border?: CaretProps['borderWidth']
} & BorderBoxProps

type PointerBoxComponent = ForwardRefComponent<typeof defaultElement, PointerBoxProps>

const PointerBox = React.forwardRef(({as = defaultElement, ...props}, ref) => {
  // don't destructure these, just grab them
  const {bg, border, borderColor} = props
  const {caret, children, ...boxProps} = props
  const caretProps = {
    bg,
    borderColor,
    borderWidth: border,
    location: caret
    // theme
  }
  return (
    <BorderBox as={as} ref={ref} sx={{position: 'relative'}} {...boxProps}>
      {children}
      <Caret {...caretProps} />
    </BorderBox>
  )
}) as PointerBoxComponent

PointerBox.displayName = 'PointerBox'

export default PointerBox
