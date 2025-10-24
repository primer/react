import React, {forwardRef} from 'react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import type {ButtonProps} from './types'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import {VisuallyHidden} from '../VisuallyHidden'
import Spinner from '../Spinner'
import CounterLabel from '../CounterLabel'
import {useId} from '../hooks'
import {ConditionalWrapper} from '../internal/components/ConditionalWrapper'
import {AriaStatus} from '../live-region'
import {clsx} from 'clsx'
import classes from './ButtonBase.module.css'
import {isElement} from 'react-is'

const renderModuleVisual = (
  Visual: React.ElementType | React.ReactElement,
  loading: boolean,
  visualName: string,
  counterLabel: boolean,
) => (
  <span
    data-component={visualName}
    className={clsx(!counterLabel && classes.Visual, loading ? classes.LoadingSpinner : classes.VisualWrap)}
  >
    {loading ? <Spinner size="small" /> : isElement(Visual) ? Visual : <Visual />}
  </span>
)

const ButtonBase = forwardRef(({children, as: Component = 'button', ...props}, forwardedRef): JSX.Element => {
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
    className,
    ...rest
  } = props

  const innerRef = React.useRef<HTMLButtonElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, innerRef)

  const uuid = useId(id)
  const loadingAnnouncementID = `${uuid}-loading-announcement`

  if (__DEV__) {
    /**
     * The Linter yells because it thinks this conditionally calls an effect,
     * but since this is a compile-time flag and not a runtime conditional
     * this is safe, and ensures the entire effect is kept out of prod builds
     * shaving precious bytes from the output, and avoiding mounting a noop effect
     */
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (
        innerRef.current &&
        !(innerRef.current instanceof HTMLButtonElement) &&
        !((innerRef.current as unknown) instanceof HTMLAnchorElement) &&
        !((innerRef.current as HTMLElement).tagName === 'SUMMARY')
      ) {
        // eslint-disable-next-line no-console
        console.warn('This component should be an instanceof a semantic button or anchor')
      }
    }, [innerRef])
  }
  return (
    <ConditionalWrapper
      // If anything is passed to `loading`, we need the wrapper:
      // If we just checked for `loading` as a boolean, the wrapper wouldn't be rendered
      // when `loading` is `false`.
      // Then, the component re-renders in a way that the button will lose focus when switching between loading states.
      if={typeof loading !== 'undefined'}
      className={block ? classes.ConditionalWrapper : undefined}
      data-loading-wrapper
    >
      <Component
        {...rest}
        aria-disabled={loading ? true : undefined}
        // @ts-ignore temporary disable as we migrate to css modules, until we remove PolymorphicForwardRefComponent
        ref={innerRef}
        className={clsx(classes.ButtonBase, className)}
        data-block={block ? 'block' : null}
        data-inactive={inactive ? true : undefined}
        data-loading={Boolean(loading)}
        data-no-visuals={!LeadingVisual && !TrailingVisual && !TrailingAction ? true : undefined}
        data-size={size}
        data-variant={variant}
        data-label-wrap={labelWrap}
        data-has-count={count !== undefined ? true : undefined}
        aria-describedby={[loadingAnnouncementID, ariaDescribedBy]
          .filter(descriptionID => Boolean(descriptionID))
          .join(' ')}
        // aria-labelledby is needed because the accessible name becomes unset when the button is in a loading state.
        // We only set it when the button is in a loading state because it will supersede the aria-label when the screen
        // reader announces the button name.
        aria-labelledby={
          loading ? [`${uuid}-label`, ariaLabelledBy].filter(labelID => Boolean(labelID)).join(' ') : ariaLabelledBy
        }
        id={id}
        // @ts-ignore temporary disable as we migrate to css modules, until we remove PolymorphicForwardRefComponent
        onClick={loading ? undefined : onClick}
      >
        {Icon ? (
          loading ? (
            <Spinner size="small" />
          ) : isElement(Icon) ? (
            Icon
          ) : (
            <Icon />
          )
        ) : (
          <>
            <span data-component="buttonContent" data-align={alignContent} className={classes.ButtonContent}>
              {
                /* If there are no leading/trailing visuals/actions to replace with a loading spinner,
                     render a loading spiner in place of the button content. */
                loading &&
                  !LeadingVisual &&
                  !TrailingVisual &&
                  !TrailingAction &&
                  count === undefined &&
                  renderModuleVisual(Spinner, loading, 'loadingSpinner', false)
              }
              {
                /* Render a leading visual unless the button is in a loading state.
                     Then replace the leading visual with a loading spinner. */
                LeadingVisual && renderModuleVisual(LeadingVisual, Boolean(loading), 'leadingVisual', false)
              }
              {children && (
                <span data-component="text" className={classes.Label} id={loading ? `${uuid}-label` : undefined}>
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
                  ? renderModuleVisual(
                      () => (
                        <CounterLabel className={classes.CounterLabel} data-component="ButtonCounter">
                          {count}
                        </CounterLabel>
                      ),
                      Boolean(loading) && !LeadingVisual,
                      'trailingVisual',
                      true,
                    )
                  : TrailingVisual
                    ? renderModuleVisual(TrailingVisual, Boolean(loading) && !LeadingVisual, 'trailingVisual', false)
                    : null
              }
            </span>
            {
              /* If there is a trailing action, render it unless the button is in a loading state
                   and there is no leading or trailing visual to replace with a loading spinner. */
              TrailingAction &&
                renderModuleVisual(
                  TrailingAction,
                  Boolean(loading) && !LeadingVisual && !TrailingVisual,
                  'trailingAction',
                  false,
                )
            }
          </>
        )}
      </Component>
      {loading && (
        <VisuallyHidden>
          <AriaStatus id={loadingAnnouncementID}>{loadingAnnouncement}</AriaStatus>
        </VisuallyHidden>
      )}
    </ConditionalWrapper>
  )
}) as PolymorphicForwardRefComponent<'button' | 'a', ButtonProps>

export {ButtonBase}
