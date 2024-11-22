import React from 'react'
import {ThemeContext} from 'styled-components'
import type {BoxProps} from '../Box'
import Box from '../Box'
import type {CaretProps} from '../Caret'
import Caret from '../Caret'
import {get} from '../constants'
import type {SxProp} from '../sx'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './PointerBox.module.css'
import {clsx} from 'clsx'

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_team'

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
  className?: string
} & BoxProps &
  MutatedSxProps

function PointerBox(props: PointerBoxProps) {
  // don't destructure these, just grab them
  const themeContext = React.useContext(ThemeContext)
  const {bg, border, borderColor, theme: themeProp, sx, className} = props
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
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  if (enabled) {
    const styles: {[key: string]: string} = {}
    if (customBackground) {
      const pointerBoxBg = `var(--bgColor-${customBackground})`
      styles['background-color'] = pointerBoxBg
      styles['background-image'] =
        `linear-gradient(${pointerBoxBg}, ${pointerBoxBg}), linear-gradient(var(--bgColor-default), var(--bgColor-default))`
    }

    if (sx) {
      return (
        <Box
          {...boxProps}
          className={clsx(className, {[classes.PointerBox]: enabled})}
          sx={{
            ...sxRest,
            '--custom-bg': get(`colors.accent.emphasis`)({theme}),
            backgroundImage: customBackground
              ? `linear-gradient(var(--custom-bg), var(--custom-bg)), linear-gradient(var(--bgColor-default), var(--bgColor-default))`
              : undefined,
            position: 'relative',
          }}
        >
          {children}
          <Caret {...caretProps} />
        </Box>
      )
    }
    return (
      <div {...boxProps} className={clsx(className, {[classes.PointerBox]: enabled})} style={styles}>
        {children}
        <Caret {...caretProps} />
      </div>
    )
  }

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
