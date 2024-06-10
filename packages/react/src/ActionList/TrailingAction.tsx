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
  ({as, icon, 'aria-label': ariaLabel, showOnHover = false, href = null, ...props}, forwardedRef) => {
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
          sx={{
            display: showOnHover ? 'none' : 'flex',
          }}
          href={href}
          // @ts-expect-error StyledButton wants both Anchor and Button refs
          ref={forwardedRef}
          {...props}
        />
      </Box>
    )
  },
) as PolymorphicForwardRefComponent<'button' | 'a', ActionListTrailingActionProps>

TrailingAction.displayName = 'ActionList.TrailingAction'
