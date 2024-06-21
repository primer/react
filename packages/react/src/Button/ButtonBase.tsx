import type {ComponentPropsWithRef} from 'react'
import React, {forwardRef, useMemo} from 'react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import Box from '../Box'
import type {BetterSystemStyleObject} from '../sx'
import {merge} from '../sx'
import {useTheme} from '../ThemeProvider'
import type {ButtonProps} from './types'
import {StyledButton} from './types'
import {getVariantStyles, getButtonStyles, getAlignContentSize} from './styles'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import {defaultSxProp} from '../utils/defaultSxProp'
import CounterLabel from '../CounterLabel'

const ButtonBase = forwardRef(
  ({children, as: Component = 'button', sx: sxProp = defaultSxProp, ...props}, forwardedRef): JSX.Element => {
    const {
      leadingVisual: LeadingVisual,
      trailingVisual: TrailingVisual,
      trailingAction: TrailingAction,
      count,
      icon: Icon,
      variant = 'default',
      size = 'medium',
      alignContent = 'center',
      block = false,
      inactive,
      labelWrap,
      ...rest
    } = props

    const innerRef = React.useRef<HTMLButtonElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, innerRef)

    const {theme} = useTheme()
    const baseStyles = useMemo(() => {
      return merge.all([getButtonStyles(theme), getVariantStyles(variant, theme)])
    }, [theme, variant])
    const sxStyles = useMemo(() => {
      return merge<BetterSystemStyleObject>(baseStyles, sxProp)
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
        if (
          innerRef.current &&
          !(innerRef.current instanceof HTMLButtonElement) &&
          !((innerRef.current as unknown) instanceof HTMLAnchorElement)
        ) {
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
        data-block={block ? 'block' : null}
        data-size={size === 'small' || size === 'large' ? size : undefined}
        data-no-visuals={!LeadingVisual && !TrailingVisual && !TrailingAction ? true : undefined}
        data-inactive={inactive ? true : undefined}
        data-label-wrap={labelWrap}
      >
        {Icon ? (
          <Icon />
        ) : (
          <>
            <Box as="span" data-component="buttonContent" sx={getAlignContentSize(alignContent)}>
              {LeadingVisual && (
                <Box as="span" data-component="leadingVisual" sx={{...iconWrapStyles}}>
                  <LeadingVisual />
                </Box>
              )}
              {children && <span data-component="text">{children}</span>}
              {count !== undefined && !TrailingVisual ? (
                <Box as="span" data-component="trailingVisual" sx={{...iconWrapStyles}}>
                  <CounterLabel data-component="ButtonCounter">{count}</CounterLabel>
                </Box>
              ) : TrailingVisual ? (
                <Box as="span" data-component="trailingVisual" sx={{...iconWrapStyles}}>
                  <TrailingVisual />
                </Box>
              ) : null}
            </Box>
            {TrailingAction && (
              <Box as="span" data-component="trailingAction" sx={{...iconWrapStyles}}>
                <TrailingAction />
              </Box>
            )}
          </>
        )}
      </StyledButton>
    )
  },
) as PolymorphicForwardRefComponent<'button' | 'a', ButtonProps>

export type ButtonBaseProps = ComponentPropsWithRef<typeof ButtonBase>

export {ButtonBase}
