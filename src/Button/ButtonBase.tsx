import React, {ComponentPropsWithRef, forwardRef, useMemo} from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import Box from '../Box'
import {merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import {ButtonProps, StyledButton} from './types'
import {getVariantStyles, getButtonStyles, getAlignContentSize} from './styles'

const defaultSxProp = {}
// const iconWrapStyles = {
//   display: 'inline-block'
// }
// const trailingIconStyles = {
//   ...iconWrapStyles,
//   ml: 2
// }

const ButtonBase = forwardRef<HTMLElement, ButtonProps>(
  ({children, as: Component = 'button', sx: sxProp = defaultSxProp, ...props}, forwardedRef): JSX.Element => {
    const {
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      trailingAction: TrailingAction,
      variant = 'default',
      size = 'medium',
      alignContent = 'center',
      block = false,
      ...rest
    } = props
    const {theme} = useTheme()
    const baseStyles = useMemo(() => {
      return merge.all([getButtonStyles(theme), getVariantStyles(variant, theme)])
    }, [theme, variant])
    const sxStyles = useMemo(() => {
      return merge(baseStyles, sxProp as SxProp)
    }, [baseStyles, sxProp])
    const iconWrapStyles = {
      display: 'flex',
      pointerEvents: 'none'
    }

    return (
      <StyledButton
        as={Component}
        sx={sxStyles}
        {...rest}
        ref={forwardedRef}
        data-component={block ? 'block' : null}
        data-size={size === 'small' || size === 'large' ? size : undefined}
      >
        <Box as="span" data-component="buttonContent" sx={getAlignContentSize(alignContent)}>
          {LeadingIcon && (
            <Box as="span" data-component="leadingVisual" sx={{...iconWrapStyles}}>
              <LeadingIcon />
            </Box>
          )}
          {children && <span data-component="text">{children}</span>}
          {TrailingIcon && (
            <Box as="span" data-component="trailingVisual" sx={{...iconWrapStyles}}>
              <TrailingIcon />
            </Box>
          )}
        </Box>
        {TrailingAction && (
          <Box as="span" data-component="trailingAction" sx={{...iconWrapStyles}}>
            <TrailingAction />
          </Box>
        )}
      </StyledButton>
    )
  }
) as PolymorphicForwardRefComponent<'button' | 'a', ButtonProps>

export type ButtonBaseProps = ComponentPropsWithRef<typeof ButtonBase>

export {ButtonBase}
