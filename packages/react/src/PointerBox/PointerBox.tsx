import React from 'react'
import {ThemeContext} from 'styled-components'
import type {BoxProps} from '../Box'
import type {CaretProps} from '../internal/components/Caret'
import Caret from '../internal/components/Caret'

export type PointerBoxProps = {
  caret?: CaretProps['location']
  bg?: CaretProps['bg']
  borderColor?: CaretProps['borderColor']
  border?: CaretProps['borderWidth']
} & BoxProps

function PointerBox(props: PointerBoxProps) {
  // don't destructure these, just grab them
  const themeContext = React.useContext(ThemeContext)
  const {bg, border, borderColor, theme: themeProp, caret, children, ...boxProps} = props
  const theme = themeProp || themeContext

  const customBackground = bg ?? 'var(--bgColor-default)'
  const customBorderColor = borderColor ?? 'var(--borderColor-default)'
  const customBorderWidth = border ?? 'var(--borderWidth-default)'

  const caretProps = {
    bg,
    borderColor,
    borderWidth: border,
    location: caret,
    theme,
  }

  return (
    <div
      style={{
        borderWidth: customBorderWidth,
        borderStyle: 'solid',
        borderColor: customBorderColor,
        borderRadius: 'var(--borderRadius-medium)',
        position: 'relative',
        background: customBackground,
        ...(boxProps.style ?? {}),
        backgroundImage: customBackground
          ? `linear-gradient(var(--custom-bg), var(--custom-bg)), linear-gradient(${theme.colors.canvas.default}, ${theme.colors.canvas.default})`
          : undefined,
      }}
      {...boxProps}
    >
      {children}
      <Caret {...caretProps} />
    </div>
  )
}

export default PointerBox
