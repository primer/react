import type React from 'react'
import {fixedForwardRef} from '../utils/modern-polymorphic'
import {Button, IconButton} from '../Button'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'

type ElementProps =
  | ({
      as?: 'button'
      href?: never
      /**
       * Specify whether the action is in a loading state.
       * Only available for button elements.
       */
      loading?: boolean
    } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  | ({
      as: 'a'
      href: string
      loading?: never
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>)

export type ActionListTrailingActionProps = ElementProps & {
  icon?: React.ElementType
  label: string
  className?: string
  children?: React.ReactNode
}

const TrailingAction = fixedForwardRef(
  ({as = 'button', icon, label, href = null, className, loading, ...props}, forwardedRef) => {
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
) as React.ForwardRefExoticComponent<ActionListTrailingActionProps & React.RefAttributes<unknown>>

TrailingAction.displayName = 'ActionList.TrailingAction'

export {TrailingAction}
