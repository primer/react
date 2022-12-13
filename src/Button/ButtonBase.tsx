import React, {ComponentPropsWithRef, forwardRef, useMemo} from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import Box from '../Box'
import {merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import {ButtonProps, StyledButton} from './types'
import {getVariantStyles, getSizeStyles, getButtonStyles} from './styles'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
declare let __DEV__: boolean

const defaultSxProp = {}
const iconWrapStyles = {
  display: 'inline-block',
}
const trailingIconStyles = {
  ...iconWrapStyles,
  ml: 2,
}

const ButtonBase = forwardRef<HTMLElement, ButtonProps>(
  ({children, as: Component = 'button', sx: sxProp = defaultSxProp, ...props}, forwardedRef): JSX.Element => {
    const {leadingIcon: LeadingIcon, trailingIcon: TrailingIcon, variant = 'default', size = 'medium', ...rest} = props
    const innerRef = React.useRef<HTMLElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, innerRef)

    const {theme} = useTheme()
    const baseStyles = useMemo(() => {
      return merge.all([getButtonStyles(theme), getSizeStyles(size, variant, false), getVariantStyles(variant, theme)])
    }, [theme, size, variant])
    const sxStyles = useMemo(() => {
      return merge(baseStyles, sxProp as SxProp)
    }, [baseStyles, sxProp])

    if (__DEV__) {
      /**
       * The Linter yells because it thinks this conditionally calls an effect,
       * but since this is a compile-time flag and not a runtime conditional
       * this is safe, and ensures the entire effect is kept out of prod builds
       * shaving precious bytes from the output, and avoiding mounting a noop effect
       */
      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useEffect(() => {
        if (!(innerRef.current instanceof HTMLButtonElement) && !(innerRef.current instanceof HTMLAnchorElement)) {
          // eslint-disable-next-line no-console
          console.warn('This component should be an instanceof a semantic button or anchor')
        }
      }, [innerRef])
    }

    return (
      <StyledButton as={Component} sx={sxStyles} {...rest} ref={innerRef}>
        {LeadingIcon && (
          <Box as="span" data-component="leadingIcon" sx={iconWrapStyles}>
            <LeadingIcon />
          </Box>
        )}
        {children && <span data-component="text">{children}</span>}
        {TrailingIcon && (
          <Box as="span" data-component="trailingIcon" sx={trailingIconStyles}>
            <TrailingIcon />
          </Box>
        )}
      </StyledButton>
    )
  },
) as PolymorphicForwardRefComponent<'button' | 'a', ButtonProps>

export type ButtonBaseProps = ComponentPropsWithRef<typeof ButtonBase>

export {ButtonBase}
