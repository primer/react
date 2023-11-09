import {CSSObject} from '@styled-system/css'
import React, {forwardRef, MouseEventHandler, useMemo} from 'react'
import {useTheme} from '../ThemeProvider'
import {hexString, isHex} from '../utils/isHex'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import RemoveTokenButton from './_RemoveTokenButton'
import TokenTextContainer from './_TokenTextContainer'
import {getColorsFromHex} from './getColorsFromHex'
import './presentationalColors.css'
import TokenBase, {defaultTokenSize, isTokenInteractive, TokenBaseProps} from './TokenBase'
export type TokenVariants =
  | 'pink'
  | 'plum'
  | 'purple'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'pine'
  | 'green'
  | 'lime'
  | 'olive'
  | 'lemon'
  | 'yellow'
  | 'orange'
  | 'amber'
  | 'red'
  | 'coral'
  | 'gray'
  | 'brown'
  | 'auburn'

export interface NewTokenProps extends TokenBaseProps {
  variant?: TokenVariants
  fillColor?: hexString
}

export type colorSchemes =
  | 'light'
  | 'light_high_contrast'
  | 'light_colorblind'
  | 'light_tritanopia'
  | 'dark'
  | 'dark_dimmed'
  | 'dark_high_contrast'
  | 'dark_colorblind'
  | 'dark_tritanopia'

export type variantColor = {
  backgroundColor: string
  textColor: string
  borderColor?: string
  backgroundColorHover?: string
  backgroundColorPressed?: string
}

const variantColors = (variant: TokenVariants, colorScheme: colorSchemes): variantColor => ({
  backgroundColor: `var(--color-presentational-${variant}-0)`,
  backgroundColorHover: `var(--color-presentational-${variant}-1)`,
  textColor: `var(--color-presentational-${variant}-7)`,
  borderColor: colorScheme.endsWith('high_contrast') ? `var(--color-presentational-${variant}-5)` : undefined,
})

const getLabelColors = (
  variant?: TokenVariants,
  fillColor?: hexString,
  resolvedColorScheme: colorSchemes = 'light',
  bgColor = '#ffffff',
): variantColor => {
  // valid variant
  if (variant) {
    return variantColors(variant, resolvedColorScheme as colorSchemes)
  }
  // valid hex string
  if (fillColor && isHex(fillColor)) {
    return getColorsFromHex(fillColor, resolvedColorScheme as colorSchemes, false, bgColor)
  }
  // if invalid variant and invalid hex string, return default
  return variantColors('gray', resolvedColorScheme as colorSchemes)
}

const NewToken = forwardRef((props, forwardedRef) => {
  const {
    as,
    variant,
    fillColor,
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

  const interactiveTokenProps = {
    as,
    href,
    onClick,
  }

  const {resolvedColorScheme, theme} = useTheme()
  const bgColor = theme?.colors.canvas.default || '#ffffff'

  const hasMultipleActionTargets = isTokenInteractive(props) && Boolean(onRemove) && !hideRemoveButton

  const onRemoveClick: MouseEventHandler = e => {
    e.stopPropagation()
    onRemove && onRemove()
  }

  const labelStyles: CSSObject = useMemo(() => {
    const {backgroundColor, textColor, borderColor, backgroundColorHover, backgroundColorPressed} = getLabelColors(
      variant,
      fillColor,
      resolvedColorScheme as colorSchemes,
      bgColor,
    )

    return {
      paddingRight: hideRemoveButton || !onRemove ? undefined : 0,
      position: 'relative',
      backgroundColor,
      color: textColor,
      border: `1px solid ${borderColor || backgroundColor}`,
      ...(isTokenInteractive(props)
        ? {
            '&:hover': {
              background: backgroundColorHover || backgroundColor,
              border: `1px solid ${borderColor || backgroundColorHover || backgroundColor}`,
            },
            '&:active': {
              background: backgroundColorPressed || backgroundColor,
              border: `1px solid ${borderColor || backgroundColorPressed || backgroundColor}`,
            },
          }
        : {}),
    }
  }, [variant, fillColor, resolvedColorScheme, bgColor, hideRemoveButton, onRemove, props])

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
}) as PolymorphicForwardRefComponent<'span' | 'a' | 'button', NewTokenProps>

NewToken.displayName = 'NewToken'

export default NewToken
