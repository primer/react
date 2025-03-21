import React, {forwardRef} from 'react'
import {Button, IconButton} from '../Button'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'

type ElementProps =
  | {
      as?: 'button'
      href?: never
    }
  | {
      as: 'a'
      href: string
    }

export type ActionListTrailingActionProps = ElementProps & {
  icon?: React.ElementType
  label: string
  className?: string
}

export const TrailingAction = forwardRef(
  ({as = 'button', icon, label, href = null, className, ...props}, forwardedRef) => {
    return (
      <span className={clsx(className, classes.TrailingAction)}>
        {icon ? (
          <IconButton
            as={as}
            aria-label={label}
            icon={icon}
            variant="invisible"
            tooltipDirection="w"
            href={href}
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

TrailingAction.displayName = 'ActionList.TrailingAction'
