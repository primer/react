import React, {forwardRef} from 'react'
import Box from '../Box'
import {Button, IconButton} from '../Button'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

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
  if (!icon) {
    return (
      <Box
        data-component="ActionList.TrailingAction"
        as="span"
        sx={{
          flexShrink: 0,
        }}
      >
        {/* @ts-expect-error TODO: Fix this */}
        <Button variant="invisible" as={as} href={href} ref={forwardedRef} {...props}>
          {label}
        </Button>
      </Box>
    )
  } else {
    return (
      <Box
        as="span"
        data-component="ActionList.TrailingAction"
        sx={{
          flexShrink: 0,
        }}
      >
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
      </Box>
    )
  }
}) as PolymorphicForwardRefComponent<'button' | 'a', ActionListTrailingActionProps>

TrailingAction.displayName = 'ActionList.TrailingAction'
