import React, {ButtonHTMLAttributes} from 'react'
import {IconProps} from '@primer/octicons-react'
import Box from '../Box'
import {SxProp} from '../sx'
import {defaultSxProp} from '../utils/defaultSxProp'

export type SegmentedControlButtonProps = {
  /** The visible label rendered in the button */
  children: string
  /** Whether the segment is selected. This is used for controlled `SegmentedControls`, and needs to be updated using the `onChange` handler on `SegmentedControl`. */
  selected?: boolean
  /** Whether the segment is selected. This is used for uncontrolled `SegmentedControls` to pick one `SegmentedControlButton` that is selected on the initial render. */
  defaultSelected?: boolean
  /** The leading icon comes before item label */
  leadingIcon?: React.FunctionComponent<React.PropsWithChildren<IconProps>>
} & SxProp &
  ButtonHTMLAttributes<HTMLButtonElement | HTMLLIElement>

const SegmentedControlButton: React.FC<React.PropsWithChildren<SegmentedControlButtonProps>> = ({
  children,
  leadingIcon: LeadingIcon,
  selected,
  sx: sxProp = defaultSxProp,
  ...rest
}) => {
  return (
    <Box as="li" data-component="SegmentedControlItem" data-selected={selected} sx={sxProp}>
      <button aria-current={selected} data-component="SegmentedControlButton" {...rest}>
        <span data-component="SegmentedControlButtonContent">
          {LeadingIcon && (
            <Box data-component="SegmentedControlLeadingVisual">
              <LeadingIcon />
            </Box>
          )}
          <Box data-component="SegmentedControlLabel" data-content={children}>
            {children}
          </Box>
        </span>
      </button>
    </Box>
  )
}

export default SegmentedControlButton
