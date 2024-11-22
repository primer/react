import React, {forwardRef} from 'react'
import Box from '../Box'
import {Button, IconButton} from '../Button'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {clsx} from 'clsx'
import {useFeatureFlag} from '../FeatureFlags'
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
}

export const TrailingAction = forwardRef(({as = 'button', icon, label, href = null, ...props}, forwardedRef) => {
  const enabled = useFeatureFlag('primer_react_css_modules_team')

  if (enabled) {
    return (
      <span className={classes.TrailingAction}>
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
}) as PolymorphicForwardRefComponent<'button' | 'a', ActionListTrailingActionProps>

TrailingAction.displayName = 'ActionList.TrailingAction'
