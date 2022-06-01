import React, {HTMLAttributes} from 'react'
import {IconProps} from '@primer/octicons-react'
import {Box} from '..'
import {merge, SxProp} from '../sx'
import getSegmentedControlButtonStyles from './getSegmentedControlStyles'

export type SegmentedControlButtonProps = {
  children?: string
  /** Whether the segment is selected */
  selected?: boolean
  /** The leading icon comes before item label */
  leadingIcon?: React.FunctionComponent<IconProps>
} & SxProp &
  HTMLAttributes<HTMLButtonElement>

// TODO: Try and get this to work without `fowardRef`
// Without it, the whole `<Box /> is marked as a very cryptic type error
const SegmentedControlButton = React.forwardRef<HTMLButtonElement, SegmentedControlButtonProps>(
  ({children, leadingIcon: LeadingIcon, selected, sx: sxProp = {}, ...rest}, forwardedRef) => {
    const sx = merge(getSegmentedControlButtonStyles({selected, children}), sxProp as SxProp)

    return (
      <Box as="button" aria-pressed={selected} sx={sx} {...rest} ref={forwardedRef}>
        <span className="segmentedControl-content">
          <Box mr={1}>{LeadingIcon && <LeadingIcon />}</Box>
          <Box className="segmentedControl-text">{children}</Box>
        </span>
      </Box>
    )
  }
)

export default SegmentedControlButton
