import React, {forwardRef} from 'react'
import Box from '../Box'
import {IconButton} from '../Button'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

export type ActionListTrailingActionProps = {
  as?: 'button' | 'a'
  icon: React.ElementType
  'aria-label': string
  showOnHover?: boolean
}

export const TrailingAction = forwardRef(
  ({as = 'button', icon, 'aria-label': ariaLabel, showOnHover = false}, forwardedRef) => {
    return (
      <Box
        as="span"
        sx={{
          flexShrink: 0,
        }}
      >
        <IconButton
          as={as}
          icon={icon}
          variant="invisible"
          unsafeDisableTooltip={false}
          tooltipDirection="w"
          aria-label={ariaLabel}
          ref={forwardedRef}
        />
      </Box>
    )
  },
) as PolymorphicForwardRefComponent<'button', ActionListTrailingActionProps>

TrailingAction.displayName = 'ActionList.TrailingAction'
