import type React from 'react'
import {forwardRef, useContext} from 'react'
import {Button, IconButton} from '../Button'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'
import {ActionListContainerContext} from './ActionListContainerContext'

type ElementProps =
  | {
      as?: 'button'
      href?: never
      /**
       * Specify whether the action is in a loading state.
       * Only available for button elements.
       */
      loading?: boolean
    }
  | {
      as: 'a'
      href: string
      loading?: never
    }

export type ActionListTrailingActionProps = ElementProps & {
  icon?: React.ElementType
  label: string
  className?: string
  style?: React.CSSProperties
}

export const TrailingAction = forwardRef(
  ({as = 'button', icon, label, href = null, className, style, loading, ...props}, forwardedRef) => {
    // Use context from ActionList
    const {selectionVariant} = useContext(ActionListContainerContext)
    // TODO: Rename
    const withinMenu = selectionVariant === 'single' || selectionVariant === 'multiple'

    if (withinMenu) {
      console.log(
        'Warning: ActionList.TrailingAction should not be used within selectable ActionLists. Please remove it to avoid unexpected behavior.',
      )
    }

    return (
      <span className={clsx(className, classes.TrailingAction)} style={style}>
        {icon ? (
          <IconButton
            as={as}
            aria-label={label}
            icon={icon}
            variant="invisible"
            tooltipDirection="e"
            href={href}
            loading={loading}
            data-loading={Boolean(loading)}
            // @ts-expect-error StyledButton wants both Anchor and Button refs
            ref={forwardedRef}
            className={classes.TrailingActionButton}
            aria-hidden={!withinMenu ? 'true' : undefined}
            tabIndex={!withinMenu ? -1 : undefined}
            {...props}
          />
        ) : (
          // @ts-expect-error shhh
          <Button
            variant="invisible"
            as={as}
            href={href}
            loading={loading}
            data-loading={Boolean(loading)}
            ref={forwardedRef}
            className={classes.TrailingActionButton}
            aria-hidden={withinMenu ? 'true' : undefined}
            {...props}
          >
            {label}
          </Button>
        )}
      </span>
    )
  },
) as PolymorphicForwardRefComponent<'button' | 'a', ActionListTrailingActionProps>

TrailingAction.__SLOT__ = Symbol('ActionList.TrailingAction')
