import React, {HTMLAttributes} from 'react'
import {IconProps} from '@primer/octicons-react'
import {Box} from '..'
import {merge, SxProp} from '../sx'
import getSegmentedControlButtonStyles from './getSegmentedControlStyles'

export type SegmentedControlIconButtonProps = {
  'aria-label': string
  /** The icon that represents the segmented control item */
  icon: React.FunctionComponent<IconProps>
  /** Whether the segment is selected */
  selected?: boolean
} & SxProp &
  HTMLAttributes<HTMLButtonElement>

// TODO: Try and get this to work without `fowardRef`
// Without it, the whole `<Box /> is marked as a very cryptic type error
//
// TODO: get tooltips working:
// - by default, the tooltip shows the `ariaLabel` content
// - allow users to pass custom tooltip text
export const SegmentedControlIconButton = React.forwardRef<HTMLButtonElement, SegmentedControlIconButtonProps>(
  ({icon: Icon, selected, sx: sxProp = {}, ...rest}, forwardedRef) => {
    const sx = merge(getSegmentedControlButtonStyles({selected}), sxProp as SxProp)

    return (
      <Box as="button" aria-pressed={selected} sx={sx} {...rest} ref={forwardedRef}>
        <span className="segmentedControl-content">
          <Icon />
        </span>
      </Box>
    )
  }
)

export default SegmentedControlIconButton
