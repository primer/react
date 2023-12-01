import React, {ComponentPropsWithRef, forwardRef, useMemo} from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import Box from '../Box'
import {BetterSystemStyleObject, merge} from '../sx'
import {useTheme} from '../ThemeProvider'
import {ButtonProps, StyledButton} from './types'
import {getVariantStyles, getButtonStyles, getAlignContentSize} from './styles'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import {defaultSxProp} from '../utils/defaultSxProp'
import {VisuallyHidden} from '../internal/components/VisuallyHidden'
import Spinner from '../Spinner'
import CounterLabel from '../CounterLabel'
import {useId} from '../hooks'

const ButtonBase = forwardRef(
  ({children, as: Component = 'button', sx: sxProp = defaultSxProp, ...props}, forwardedRef): JSX.Element => {
    const {
      leadingVisual: LeadingVisual,
      trailingVisual: TrailingVisual,
      trailingAction: TrailingAction,
      ['aria-describedby']: ariaDescribedBy,
      ['aria-labelledby']: ariaLabelledBy,
      count,
      icon: Icon,
      id,
      variant = 'default',
      size = 'medium',
      alignContent = 'center',
      block = false,
      loading = false,
      loadingAnnouncement = 'Loading',
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
    const uuid = useId(id)
    const loadingAnnouncementID = `${uuid}-loading-announcement`
    const buttonLabelID = ariaLabelledBy || `${uuid}-label`

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
      <>
        <StyledButton
          as={Component}
          sx={sxStyles}
          {...rest}
          ref={innerRef}
          data-block={block ? 'block' : null}
          data-size={size === 'small' || size === 'large' ? size : undefined}
          data-no-visuals={!LeadingVisual && !TrailingVisual && !TrailingAction ? true : undefined}
          aria-disabled={loading ? true : undefined}
          aria-describedby={[loadingAnnouncementID, ariaDescribedBy]
            .filter(descriptionID => Boolean(descriptionID))
            .join(' ')}
          // aria-labelledby is needed because the accessible name becomes unset when the button is in a loading state
          aria-labelledby={buttonLabelID}
          id={id}
        >
          {Icon ? (
            loading ? (
              <Spinner size="small" />
            ) : (
              <Icon />
            )
          ) : (
            <>
              <Box as="span" data-component="buttonContent" sx={getAlignContentSize(alignContent)}>
                {loading && !LeadingVisual && !TrailingVisual && (
                  <Box as="span" data-component="loadingSpinner" sx={{...iconWrapStyles}}>
                    <Spinner size="small" />
                  </Box>
                )}
                {LeadingVisual && loading && (
                  <Box as="span" data-component="leadingVisual" sx={{...iconWrapStyles}}>
                    <Spinner size="small" />
                  </Box>
                )}
                {LeadingVisual && !loading && (
                  <Box as="span" data-component="leadingVisual" sx={{...iconWrapStyles}}>
                    <LeadingVisual />
                  </Box>
                )}
                {children && (
                  <span data-component="text" id={buttonLabelID}>
                    {children}
                    {count !== undefined && !TrailingVisual && (
                      <CounterLabel data-component="ButtonCounter" sx={{ml: 2}}>
                        {count}
                      </CounterLabel>
                    )}
                  </span>
                )}
                {TrailingVisual && !loading && (
                  <Box as="span" data-component="trailingVisual" sx={{...iconWrapStyles}}>
                    <TrailingVisual />
                  </Box>
                )}
                {TrailingVisual && loading && (
                  <Box as="span" data-component="trailingVisual" sx={{...iconWrapStyles}}>
                    <Spinner size="small" />
                  </Box>
                )}
              </Box>
              {TrailingAction && (
                <Box as="span" data-component="trailingAction" sx={{...iconWrapStyles}}>
                  <TrailingAction />
                </Box>
              )}
            </>
          )}
        </StyledButton>
        <VisuallyHidden>
          <span aria-live="polite" id={loadingAnnouncementID}>
            {loading && loadingAnnouncement}
          </span>
        </VisuallyHidden>
      </>
    )
  },
) as PolymorphicForwardRefComponent<'button' | 'a', ButtonProps>

export type ButtonBaseProps = ComponentPropsWithRef<typeof ButtonBase>

export {ButtonBase}
