import {CSSObject} from '@styled-system/css'
import {getContrast, getLuminance, toHex} from 'color2k'
import {Hsluv} from 'hsluv'
import React from 'react'
import {get} from '../constants'
import {useTheme} from '../ThemeProvider'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import TokenBase, {defaultTokenSize, isTokenInteractive, TokenBaseProps} from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'
import TokenTextContainer from './_TokenTextContainer'

export interface IssueLabelTokenProps extends TokenBaseProps {
  /**
   * The color that corresponds to the label
   */
  fillColor?: string
}

const tokenBorderWidthPx = 1

const IssueLabelToken = React.forwardRef((props, forwardedRef) => {
  const {
    as,
    fillColor = '#999',
    onRemove,
    id,
    isSelected,
    text,
    size = defaultTokenSize,
    hideRemoveButton,
    href,
    onClick,
    ...rest
  } = props

  const interactiveTokenProps = {as, href, onClick}

  const colorMode = useColorMode()

  const hasMultipleActionTargets = isTokenInteractive(props) && Boolean(onRemove) && !hideRemoveButton

  const onRemoveClick: React.MouseEventHandler = event => {
    event.stopPropagation()
    onRemove?.()
  }

  const labelStyles: CSSObject = React.useMemo(() => {
    // Parse label color into hue, saturation, lightness using HSLUV
    const {h, s} = hexToHsluv(fillColor)

    // Initialize color variables
    let bgColor = ''
    let textColor = ''
    let borderColor = ''

    // Set color variables based on current color mode
    switch (colorMode) {
      case 'light': {
        bgColor = hsluvToHex({h, s: Math.min(s, 90), l: 97})
        textColor = minContrast(hsluvToHex({h, s: Math.min(s, 85), l: 45}), bgColor, 4.5)
        borderColor = hsluvToHex({h, s: Math.min(s, 70), l: 82})
        break
      }

      case 'dark': {
        bgColor = hsluvToHex({h, s: Math.min(s, 90), l: 8})
        textColor = minContrast(hsluvToHex({h, s: Math.min(s, 50), l: 70}), bgColor, 4.5)
        borderColor = hsluvToHex({h, s: Math.min(s, 80), l: 20})
        break
      }
    }

    return {
      position: 'relative',
      color: textColor,
      background: bgColor,
      border: `${tokenBorderWidthPx}px solid ${borderColor}`,
      paddingRight: onRemove && !hideRemoveButton ? 0 : undefined,
      ...(isSelected
        ? {
            ':focus': {
              outline: 'none',
            },
            ':after': {
              content: '""',
              position: 'absolute',
              zIndex: 1,
              top: `-${tokenBorderWidthPx * 2}px`,
              right: `-${tokenBorderWidthPx * 2}px`,
              bottom: `-${tokenBorderWidthPx * 2}px`,
              left: `-${tokenBorderWidthPx * 2}px`,
              display: 'block',
              pointerEvents: 'none',
              boxShadow: `0 0 0 ${tokenBorderWidthPx * 2}px ${textColor}`,
              borderRadius: '999px',
            },
          }
        : {}),
    }
  }, [colorMode, fillColor, isSelected, hideRemoveButton, onRemove])

  return (
    <TokenBase
      onRemove={onRemove}
      id={id?.toString()}
      isSelected={isSelected}
      text={text}
      size={size}
      sx={labelStyles}
      {...(!hasMultipleActionTargets ? interactiveTokenProps : {})}
      {...rest}
      ref={forwardedRef}
    >
      <TokenTextContainer {...(hasMultipleActionTargets ? interactiveTokenProps : {})}>{text}</TokenTextContainer>
      {!hideRemoveButton && onRemove ? (
        <RemoveTokenButton
          borderOffset={tokenBorderWidthPx}
          onClick={onRemoveClick}
          size={size}
          aria-hidden={hasMultipleActionTargets ? 'true' : 'false'}
          isParentInteractive={isTokenInteractive(props)}
          sx={
            hasMultipleActionTargets
              ? {
                  position: 'relative',
                  zIndex: '1',
                }
              : {}
          }
        />
      ) : null}
    </TokenBase>
  )
}) as PolymorphicForwardRefComponent<'span' | 'a' | 'button', IssueLabelTokenProps>

IssueLabelToken.displayName = 'IssueLabelToken'

export default IssueLabelToken

// Helper functions

function useColorMode(): 'light' | 'dark' {
  const {theme} = useTheme()
  // Determine color mode by luminance
  const colorMode = getLuminance(get('colors.canvas.default')({theme}) || '#fff') > 0.5 ? 'light' : 'dark'
  return colorMode
}

function hexToHsluv(hex: string) {
  const color = new Hsluv()
  color.hex = toHex(hex) // Ensure hex is actually a hex color
  color.hexToHsluv()
  return {h: color.hsluv_h, s: color.hsluv_s, l: color.hsluv_l}
}

function hsluvToHex({h, s, l}: {h: number; s: number; l: number}) {
  const color = new Hsluv()
  // eslint-disable-next-line camelcase
  color.hsluv_h = h
  // eslint-disable-next-line camelcase
  color.hsluv_s = s
  // eslint-disable-next-line camelcase
  color.hsluv_l = l
  color.hsluvToHex()
  return color.hex
}

/** Returns a foreground color that has a given minimum contrast ratio against the given background color */
function minContrast(fg: string, bg: string, minRatio: number) {
  // eslint-disable-next-line prefer-const
  let {h, s, l} = hexToHsluv(fg)

  // While foreground color doesn't meet the contrast ratio,
  // increase or decrease the lightness until it does
  while (getContrast(hsluvToHex({h, s, l}), bg) < minRatio && l <= 100 && l >= 0) {
    if (getLuminance(bg) > getLuminance(fg)) {
      l -= 1
    } else {
      l += 1
    }
  }

  return hsluvToHex({h, s, l})
}
