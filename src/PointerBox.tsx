import React from 'react'
import {ThemeContext} from 'styled-components'
import BorderBox, {BorderBoxProps} from './BorderBox'
import Caret, {CaretProps} from './Caret'

export type PointerBoxProps = {
  caret?: CaretProps['location']
  bg?: CaretProps['bg']
  borderColor?: CaretProps['borderColor']
  border?: CaretProps['borderWidth']
} & BorderBoxProps

function PointerBox(props: PointerBoxProps) {
  const themeContext = React.useContext(ThemeContext)
  // don't destructure these, just grab them
  const {bg, border, borderColor, theme} = props
  const {caret, children, ...boxProps} = props
  const caretProps = {
    bg,
    borderColor,
    borderWidth: border,
    location: caret,
    theme: theme ?? themeContext
  }
  return (
    <BorderBox sx={{position: 'relative'}} {...boxProps}>
      {children}
      <Caret {...caretProps} />
    </BorderBox>
  )
}

export default PointerBox
