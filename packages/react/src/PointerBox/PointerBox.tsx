import React from 'react'
import {ThemeContext} from 'styled-components'
import type {BoxProps} from '../Box'
import Box from '../Box'
import type {CaretProps} from '../Caret'
import Caret from '../Caret'
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

export type PointerBoxProps = {
  /** Sets the location of the caret. The format is [edge]-[position on edge]. For example, right-top will position the caret on the top of the right edge of the box. */
  caret?: CaretProps['location']
  /** Background color of the box */
  bg?: CaretProps['bg']
  /** Color of the border around the box */
  borderColor?: CaretProps['borderColor']
  /** Width of the border around the box */
  border?: CaretProps['borderWidth']
} & BoxProps &
  MutatedSxProps

/**
 * A customisable bordered box with a caret pointer
 * @primerid pointer_box
 * @primerstatus alpha
 * @primera11yreviewed false
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
