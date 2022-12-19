import React, {ComponentPropsWithRef, forwardRef, useMemo} from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import Box from '../Box'
import {merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import {ButtonProps, StyledButton} from './types'
import {getVariantStyles, getButtonStyles, getAlignContentSize} from './styles'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
declare let __DEV__: boolean

const defaultSxProp = {}
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

    const innerRef = React.useRef<HTMLElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, innerRef)

    const {theme} = useTheme()
    const baseStyles = useMemo(() => {
      return merge.all([getButtonStyles(theme), getVariantStyles(variant, theme)])
    }, [theme, variant])
    const sxStyles = useMemo(() => {
      return merge(baseStyles, sxProp as SxProp)
    }, [baseStyles, sxProp])
    const iconWrapStyles = {
      display: 'flex',
      pointerEvents: 'none',
    }

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
      <StyledButton
        as={Component}
        sx={sxStyles}
        {...rest}
        ref={innerRef}
        data-component={block ? 'block' : null}
        data-size={size === 'small' || size === 'large' ? size : undefined}
        data-no-visuals={!LeadingIcon && !TrailingIcon && !TrailingAction ? true : undefined}
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
  },
) as PolymorphicForwardRefComponent<'button' | 'a', ButtonProps>

export type ButtonBaseProps = ComponentPropsWithRef<typeof ButtonBase>

export {ButtonBase}
