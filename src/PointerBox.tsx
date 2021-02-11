import React from 'react'
import PropTypes from 'prop-types'
import BorderBox, {BorderBoxProps} from './BorderBox'
import Caret, {CaretProps} from './Caret'
import theme from './theme'

export type PointerBoxProps = {
  caret?: CaretProps['location']
  bg?: CaretProps['bg']
  borderColor?: CaretProps['borderColor']
  border?: CaretProps['borderWidth']
} & BorderBoxProps

function PointerBox(props: PointerBoxProps) {
  // don't destructure these, just grab them
  const {bg, border, borderColor} = props
  const {caret, children, ...boxProps} = props
  const caretProps = {bg, borderColor, borderWidth: border, location: caret}
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
