import React, {ComponentPropsWithRef, forwardRef, useMemo} from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import Box from '../Box'
import {merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import {ButtonProps, StyledButton} from './types'
import {getVariantStyles, getSizeStyles, getButtonStyles, getAlignContentSize} from './styles'
import CounterLabel from '../CounterLabel'

const ButtonBase = forwardRef<HTMLElement, ButtonProps>(
  ({children, as: Component = 'button', sx: sxProp = {}, ...props}, forwardedRef): JSX.Element => {
    const {
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      trailingAction: TrailingAction,
      trailingVisualCount,
      variant = 'default',
      size = 'medium',
      alignContent = 'center',
      block = false
    } = props
    const {theme} = useTheme()
    const iconWrapStyles = {
      display: 'flex',
      pointerEvents: 'none'
    }
    const sxStyles = useMemo(() => {
      return merge.all([getButtonStyles(theme), getSizeStyles(size, false), getVariantStyles(variant, theme)])
    }, [theme, size, variant])

    return (
      <StyledButton
        as={Component}
        sx={merge(sxStyles, sxProp as SxProp)}
        {...props}
        ref={forwardedRef}
        data-component={block ? 'block' : null}
      >
        <Box as="span" data-component="buttonContent" sx={getAlignContentSize(alignContent)}>
          {LeadingIcon && (
            <Box as="span" data-component="leadingIcon" sx={{...iconWrapStyles}}>
              <LeadingIcon />
            </Box>
          )}
          {children && <span data-component="text">{children}</span>}
          {trailingVisualCount !== undefined ? (
            <Box as="span" data-component="trailingIcon" sx={{...iconWrapStyles}}>
              <CounterLabel data-component="ButtonCounter">{trailingVisualCount}</CounterLabel>
            </Box>
          ) : TrailingIcon ? (
            <Box as="span" data-component="trailingIcon" sx={{...iconWrapStyles}}>
              <TrailingIcon />
            </Box>
          ) : null}
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
