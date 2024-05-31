import React, {forwardRef} from 'react'
// import type {SxProp} from '../sx'
import type {IconButtonProps} from '../Button'
import Box from '../Box'
import {IconButton} from '../Button'
// import {TEXT_ROW_HEIGHT} from './shared'

export type ActionListTrailingActionProps = IconButtonProps

export const TrailingAction = forwardRef<HTMLButtonElement, ActionListTrailingActionProps>(
  ({...props}, forwardedRef) => {
    return (
      <Box
        as="span"
        sx={{
          marginLeft: 2,
          flexShrink: 0,
        }}
      >
        <IconButton
          variant="invisible"
          unsafeDisableTooltip={false}
          tooltipDirection="w"
          {...props}
          ref={forwardedRef}
        />
      </Box>
    )
  },
)

TrailingAction.displayName = 'ActionList.TrailingAction'
