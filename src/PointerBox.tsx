import React from 'react'
import Box, {BoxProps} from './Box'
import Caret, {CaretProps} from './Caret'
import {SxProp} from './sx'

// FIXME: Make this work with BetterStyledSystem types
type MutatedSxProps = {
  sx?: {
    bg?: string
    backgroundColor?: string
    borderColor?: string
  }
} & SxProp

export type PointerBoxProps = {
  caret?: CaretProps['location']
  bg?: CaretProps['bg']
  borderColor?: CaretProps['borderColor']
  border?: CaretProps['borderWidth']
} & BoxProps &
  MutatedSxProps

function PointerBox(props: PointerBoxProps) {
  // don't destructure these, just grab them
  const {bg, border, borderColor, theme, sx} = props
  const {caret, children, ...boxProps} = props

  const caretProps = {
    bg: bg || sx?.bg || sx?.backgroundColor,
    borderColor: borderColor || sx?.borderColor,
    borderWidth: border,
    location: caret,
    theme
  }

  const defaultBoxProps = {borderWidth: '1px', borderStyle: 'solid', borderColor: 'border.default', borderRadius: 2}

  return (
    <Box {...defaultBoxProps} {...boxProps} sx={{...sx, position: 'relative'}}>
      {children}
      <Caret {...caretProps} />
    </Box>
  )
}

export default PointerBox
