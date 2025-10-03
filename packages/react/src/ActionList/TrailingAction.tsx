import type React from 'react'
import {forwardRef} from 'react'
import {Button, IconButton} from '../Button'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'

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
    return (
      <span className={clsx(className, classes.TrailingAction)} style={style}>
        {icon ? (
          <IconButton
            as={as}
            aria-label={label}
            icon={icon}
            variant="invisible"
            tooltipDirection="w"
            href={href}
            loading={loading}
            data-loading={Boolean(loading)}
            // @ts-expect-error StyledButton wants both Anchor and Button refs
            ref={forwardedRef}
            className={classes.TrailingActionButton}
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
            {...props}
          >
            {label}
          </Button>
        )}
      </span>
    )
  },
) as PolymorphicForwardRefComponent<'button' | 'a', ActionListTrailingActionProps>
