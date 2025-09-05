import React from 'react'
import {ThemeContext} from 'styled-components'
import type {BoxProps} from '../Box'
import Box from '../Box'
import type {CaretProps} from '../internal/components/Caret'
import Caret from '../internal/components/Caret'
import {get} from '../constants'
import type {SxProp} from '../sx'

// FIXME: Make this work with BetterStyledSystem types
type MutatedSxProps = {
  sx?: {
    bg?: string
    backgroundColor?: string
    borderColor?: string
  }
} & SxProp

/**
 * @deprecated PointerBox is deprecated and will be removed in a future major release.
 * Consider using Overlay or Position + Box with a caret instead.
 */
export type PointerBoxProps = {
  caret?: CaretProps['location']
  bg?: CaretProps['bg']
  borderColor?: CaretProps['borderColor']
  border?: CaretProps['borderWidth']
} & BoxProps &
  MutatedSxProps

/**
 * @deprecated PointerBox is deprecated and will be removed in a future major release.
 * Consider using Overlay or Position + Box with a caret instead.
 */
function PointerBox(props: PointerBoxProps) {
  // don't destructure these, just grab them
  const themeContext = React.useContext(ThemeContext)
  const {bg, border, borderColor, theme: themeProp, sx} = props
  const {caret, children, ...boxProps} = props
  const {bg: sxBg, backgroundColor, ...sxRest} = sx || {}
  const theme = themeProp || themeContext
  const customBackground = bg || sxBg || backgroundColor

  const caretProps = {
    bg: bg || sx?.bg || sx?.backgroundColor,
    borderColor: borderColor || sx?.borderColor,
    borderWidth: border,
    location: caret,
    theme,
  }

  const defaultBoxProps = {borderWidth: '1px', borderStyle: 'solid', borderColor: 'border.default', borderRadius: 2}

  return (
    <Box
      {...defaultBoxProps}
      {...boxProps}
      sx={{
        ...sxRest,
        '--custom-bg': get(`colors.${customBackground}`)({theme}),
        backgroundImage: customBackground
          ? `linear-gradient(var(--custom-bg), var(--custom-bg)), linear-gradient(${theme.colors.canvas.default}, ${theme.colors.canvas.default})`
          : undefined,
        position: 'relative',
      }}
    >
      {children}
      <Caret {...caretProps} />
    </Box>
  )
}

export default PointerBox
