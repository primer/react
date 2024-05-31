import React, {forwardRef} from 'react'
// import type {SxProp} from '../sx'
import type {IconButtonProps} from '../Button'
import Box from '../Box'
import {IconButton} from '../Button'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

// import {TEXT_ROW_HEIGHT} from './shared'

export type ActionListTrailingActionProps = IconButtonProps

// const trailingActionRef = useRef()
// <ActionItem.TrailingAction ref={trailingActionRef}
export const TrailingAction = forwardRef(({...props}, forwardedRef) => {
  return (
    <Box
      as="span"
      sx={{
        marginLeft: 2,
        flexShrink: 0,
      }}
    >
      <IconButton variant="invisible" unsafeDisableTooltip={false} tooltipDirection="w" {...props} ref={forwardedRef} />
    </Box>
  )
}) as PolymorphicForwardRefComponent<'button', ActionListTrailingActionProps>

TrailingAction.displayName = 'ActionList.TrailingAction'
