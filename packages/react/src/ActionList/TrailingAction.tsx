import React, {forwardRef} from 'react'
import Box from '../Box'
import {Button, IconButton} from '../Button'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {clsx} from 'clsx'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './ActionList.module.css'
import {actionListCssModulesFlag} from './featureflag'

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
    const enabled = useFeatureFlag(actionListCssModulesFlag)

    if (enabled) {
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
    }

    return (
      <Box
        as="span"
        data-component="ActionList.TrailingAction"
        sx={{
          flexShrink: 0,
        }}
      >
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
            {...props}
          />
        ) : (
          // @ts-expect-error shhh
          <Button variant="invisible" as={as} href={href} ref={forwardedRef} {...props}>
            {label}
          </Button>
        )}
      </Box>
    )
  },
) as PolymorphicForwardRefComponent<'button' | 'a', ActionListTrailingActionProps>

TrailingAction.displayName = 'ActionList.TrailingAction'
