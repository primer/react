import type React from 'react'
import {forwardRef} from 'react'
import {Button, ButtonBase, IconButton} from '../Button'
import type {IconButtonProps} from '../Button/types'
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
} & Pick<IconButtonProps, 'tooltipDirection'>

export const TrailingAction = forwardRef(
  (
    {as = 'button', icon, label, href = null, className, style, loading, tooltipDirection = 'w', ...props},
    forwardedRef,
  ) => {
    return (
      <span
        className={clsx(className, classes.TrailingAction)}
        data-component="ActionList.TrailingAction"
        style={style}
      >
        {icon ? (
          <IconButton
            as={as}
            aria-label={label}
            icon={icon}
            variant="invisible"
            tooltipDirection={tooltipDirection}
            href={href}
            loading={loading}
            data-loading={Boolean(loading)}
            // @ts-expect-error StyledButton wants both Anchor and Button refs
            ref={forwardedRef}
            className={classes.TrailingActionButton}
            {...props}
          />
        ) : as === 'a' ? (
          <ButtonBase
            variant="invisible"
            as="a"
            href={href}
            data-has-label="true"
            // @ts-expect-error StyledButton wants both Anchor and Button refs
            ref={forwardedRef}
            className={classes.TrailingActionButton}
            {...props}
          >
            {label}
          </ButtonBase>
        ) : (
          <Button
            variant="invisible"
            loading={loading}
            data-loading={Boolean(loading)}
            data-has-label="true"
            // @ts-expect-error StyledButton wants both Anchor and Button refs
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

TrailingAction.__SLOT__ = Symbol('ActionList.TrailingAction')
