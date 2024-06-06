import React, {forwardRef} from 'react'
import Box from '../Box'
import {IconButton} from '../Button'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

export type ActionListTrailingActionProps = {
  as?: 'button' | 'a'
  href?: string
  icon: React.ElementType
  'aria-label': string
  showOnHover?: boolean
}

export const TrailingAction = forwardRef(
  ({as = 'button', icon, 'aria-label': ariaLabel, showOnHover = false, ...props}, forwardedRef) => {
    return (
      <Box
        as="span"
        sx={{
          flexShrink: 0,
        }}
      >
        <IconButton
          as={as}
          aria-label={ariaLabel}
          icon={icon}
          variant="invisible"
          unsafeDisableTooltip={false}
          tooltipDirection="w"
          {...props}
          ref={forwardedRef}
        />
      </Box>
    )
  },
) as PolymorphicForwardRefComponent<'button' | 'a', ActionListTrailingActionProps>

TrailingAction.displayName = 'ActionList.TrailingAction'
