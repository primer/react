import React, {forwardRef, MouseEventHandler} from 'react'
import styled, {css} from 'styled-components'
import TokenBase, {isTokenInteractive, TokenBaseProps} from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'
import tinycolor from 'tinycolor2'
import {useTheme} from '../ThemeProvider'
import TokenTextContainer from './_TokenTextContainer'

interface ColorModeConfig {
  bgOpacity: number
  borderThreshold: number
  borderOpacity: number
  lightnessThreshold: number
}

const colorModeConfigs: Record<string, ColorModeConfig> = {
  dark: {
    bgOpacity: 0.18,
    borderThreshold: 0,
    borderOpacity: 0.3,
    lightnessThreshold: 0.6
  },
  light: {
    bgOpacity: 1,
    borderThreshold: 0.96,
    borderOpacity: 1,
    lightnessThreshold: 0.453
  }
}

export interface IssueLabelTokenProps extends TokenBaseProps {
  /**
   * The color that corresponds to the label
   */
  fillColor?: string
  /**
   * Whether the remove button should be rendered in the token
   */
  hideRemoveButton?: boolean
}

interface LabelStyleProps {
  bgColor: React.CSSProperties['backgroundColor']
  borderColor: React.CSSProperties['borderColor']
  textColor: React.CSSProperties['color']
}

const tokenBorderWidthPx = 1

const StyledIssueLabelToken = styled(TokenBase)<IssueLabelTokenProps & LabelStyleProps>`
  background-color: ${props => props.bgColor};
  border-width: ${tokenBorderWidthPx}px;
  border-style: solid;
  border-color: ${props => props.borderColor};
  color: ${props => props.textColor};
  padding-right: ${props => (!props.hideRemoveButton ? 0 : undefined)};
  position: relative;

  ${props => {
    if (props.isSelected) {
      return css`
        &:after {
          content: '';
          position: absolute;
          z-index: 1;
          top: -2px;
          right: -2px;
          bottom: -2px;
          left: -2px;
          display: block;
          pointer-events: none;
          box-shadow: 0 0 0 2px ${props.bgColor};
          border-radius: 999px;
        }
      `
    }
  }}
`

const IssueLabelToken = forwardRef<HTMLElement, IssueLabelTokenProps>((props, forwardedRef) => {
  const {as, fillColor, onRemove, id, isSelected, ref, text, size, hideRemoveButton, href, onClick, ...rest} = props
  const interactiveTokenProps = {
    as,
    href,
    onClick
  }
  const {colorScheme} = useTheme()
  const {bgOpacity, borderOpacity, borderThreshold, lightnessThreshold} = colorModeConfigs[colorScheme || 'light']
  let bgColor = fillColor
  let borderColor = fillColor
  let textColor = '#FFF'
  const perceivedLightness = tinycolor(fillColor).getLuminance()
  const isFillColorLight = perceivedLightness >= lightnessThreshold

  if (colorScheme === 'dark') {
    const lightenBy = (perceivedLightness - lightnessThreshold) * 100 * (isFillColorLight ? 1 : 0)

    bgColor = isSelected
      ? tinycolor(fillColor)
          .setAlpha(bgOpacity * 1.2)
          .toRgbString()
      : tinycolor(fillColor).setAlpha(bgOpacity).toRgbString()
    textColor = isSelected
      ? tinycolor(fillColor)
          .lighten(lightenBy + 10)
          .toString()
      : tinycolor(fillColor).lighten(lightenBy).toString()
    borderColor = isSelected
      ? tinycolor(fillColor)
          .lighten(lightenBy + 5)
          .toRgbString()
      : tinycolor(fillColor).lighten(lightenBy).setAlpha(borderOpacity).toRgbString()
  } else {
    const isFillColorDark = perceivedLightness < 0.1
    borderColor = perceivedLightness >= borderThreshold ? tinycolor(fillColor).darken(25).toString() : 'transparent'

    if (isFillColorLight) {
      textColor = '#000'
    }

    if (isSelected) {
      bgColor = isFillColorDark
        ? tinycolor(fillColor).lighten(10).toString()
        : // TODO: darken more than 10 if the fillColor is really bright and doesn't darken well
          //       Examples of colors that don't darken well:
          //       - #a2eeef
          //       - #ffd78e
          //       - #a4f287
          tinycolor(fillColor).darken(10).toString()
    }
  }

  const hasMultipleActionTargets = isTokenInteractive(props) && Boolean(onRemove) && !hideRemoveButton
  const onRemoveClick: MouseEventHandler = e => {
    e.stopPropagation()
    onRemove && onRemove()
  }

  return (
    <StyledIssueLabelToken
      // specific to labels
      fillColor={fillColor}
      bgColor={bgColor}
      borderColor={borderColor}
      textColor={textColor}
      // common token props
      hideRemoveButton={hideRemoveButton || !onRemove}
      onRemove={onRemove}
      id={id?.toString()}
      isSelected={isSelected}
      ref={forwardedRef}
      text={text}
      size={size}
      {...(!hasMultipleActionTargets ? interactiveTokenProps : {})}
      {...rest}
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
                  zIndex: '1'
                }
              : {}
          }
        />
      ) : null}
    </StyledIssueLabelToken>
  )
})

IssueLabelToken.defaultProps = {
  fillColor: '#999'
}

export default IssueLabelToken
