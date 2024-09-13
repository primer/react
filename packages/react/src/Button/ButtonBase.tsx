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
import {VisuallyHidden} from '../internal/components/VisuallyHidden'
import Spinner from '../Spinner'
import CounterLabel from '../CounterLabel'
import {useId} from '../hooks'
import {ConditionalWrapper} from '../internal/components/ConditionalWrapper'
import {AriaStatus} from '../live-region'

const iconWrapStyles = {
  display: 'flex',
  pointerEvents: 'none',
}

const renderVisual = (Visual: React.ElementType, loading: boolean, visualName: string) => (
  <Box as="span" data-component={visualName} sx={{...iconWrapStyles}}>
    {loading ? <Spinner size="small" /> : <Visual />}
  </Box>
)

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
      loading,
      loadingAnnouncement = 'Loading',
      inactive,
      onClick,
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
    const uuid = useId(id)
    const loadingAnnouncementID = `${uuid}-loading-announcement`

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
      <ConditionalWrapper
        // If anything is passsed to `loading`, we need the wrapper:
        // If we just checked for `loading` as a boolean, the wrapper wouldn't be rendered
        // when `loading` is `false`.
        // Then, the component re-renders in a way that the button will lose focus when switching between loading states.
        if={typeof loading !== 'undefined'}
        sx={{display: block ? 'block' : 'inline-block'}}
        data-loading-wrapper
      >
        <StyledButton
          as={Component}
          sx={sxStyles}
          aria-disabled={loading ? true : undefined}
          {...rest}
          ref={innerRef}
          data-block={block ? 'block' : null}
          data-inactive={inactive ? true : undefined}
          data-loading={Boolean(loading)}
          data-no-visuals={!LeadingVisual && !TrailingVisual && !TrailingAction ? true : undefined}
          data-size={size === 'small' || size === 'large' ? size : undefined}
          data-label-wrap={labelWrap}
          aria-describedby={[loadingAnnouncementID, ariaDescribedBy]
            .filter(descriptionID => Boolean(descriptionID))
            .join(' ')}
          // aria-labelledby is needed because the accessible name becomes unset when the button is in a loading state.
          // We only set it when the button is in a loading state because it will supercede the aria-label when the screen
          // reader announces the button name.
          aria-labelledby={
            loading ? [`${uuid}-label`, ariaLabelledBy].filter(labelID => Boolean(labelID)).join(' ') : ariaLabelledBy
          }
          id={id}
          onClick={loading ? undefined : onClick}
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
                {
                  /* If there are no leading/trailing visuals/actions to replace with a loading spinner,
                     render a loading spiner in place of the button content. */
                  loading &&
                    !LeadingVisual &&
                    !TrailingVisual &&
                    !TrailingAction &&
                    renderVisual(Spinner, loading, 'loadingSpinner')
                }
                {
                  /* Render a leading visual unless the button is in a loading state.
                     Then replace the leading visual with a loading spinner. */
                  LeadingVisual && renderVisual(LeadingVisual, Boolean(loading), 'leadingVisual')
                }
                {children && (
                  <span data-component="text" id={loading ? `${uuid}-label` : undefined}>
                    {children}
                  </span>
                )}
                {
                  /* If there is a count, render a counter label unless there is a trailing visual.
                     Then render the counter label as a trailing visual.
                     Replace the counter label or the trailing visual with a loading spinner if:
                     - the button is in a loading state
                     - there is no leading visual to replace with a loading spinner
                  */
                  count !== undefined && !TrailingVisual
                    ? renderVisual(
                        () => <CounterLabel data-component="ButtonCounter">{count}</CounterLabel>,
                        Boolean(loading) && !LeadingVisual,
                        'trailingVisual',
                      )
                    : TrailingVisual
                    ? renderVisual(TrailingVisual, Boolean(loading) && !LeadingVisual, 'trailingVisual')
                    : null
                }
              </Box>
              {
                /* If there is a trailing action, render it unless the button is in a loading state
                   and there is no leading or trailing visual to replace with a loading spinner. */
                TrailingAction &&
                  renderVisual(TrailingAction, Boolean(loading) && !LeadingVisual && !TrailingVisual, 'trailingAction')
              }
            </>
          )}
        </StyledButton>
        {loading && (
          <VisuallyHidden>
            <AriaStatus id={loadingAnnouncementID}>{loadingAnnouncement}</AriaStatus>
          </VisuallyHidden>
        )}
      </ConditionalWrapper>
    )
  },
) as PolymorphicForwardRefComponent<'button' | 'a', ButtonProps>

export type ButtonBaseProps = ComponentPropsWithRef<typeof ButtonBase>

export {ButtonBase}
