import React, {ButtonHTMLAttributes} from 'react'
import {IconProps} from '@primer/octicons-react'
import {SxProp} from '../sx'
import Box from '../Box'
import {defaultSxProp} from '../utils/defaultSxProp'

export type SegmentedControlIconButtonProps = {
  'aria-label': string
  /** The icon that represents the segmented control item */
  icon: React.FunctionComponent<React.PropsWithChildren<IconProps>>
  /** Whether the segment is selected. This is used for controlled SegmentedControls, and needs to be updated using the onChange handler on SegmentedControl. */
  selected?: boolean
  /** Whether the segment is selected. This is used for uncontrolled SegmentedControls to pick one SegmentedControlButton that is selected on the initial render. */
  defaultSelected?: boolean
} & SxProp &
  ButtonHTMLAttributes<HTMLButtonElement | HTMLLIElement>

// TODO: update this component to be accessible when we update the Tooltip component
// - we wouldn't render tooltip content inside a pseudoelement
// - users can pass custom tooltip text in addition to `ariaLabel`
//
// See Slack thread: https://github.slack.com/archives/C02NUUQ9C30/p1656444474509599
//
export const SegmentedControlIconButton: React.FC<React.PropsWithChildren<SegmentedControlIconButtonProps>> = ({
  'aria-label': ariaLabel,
  icon: Icon,
  selected,
  sx: sxProp = defaultSxProp,
  ...rest
}) => {
  return (
    <Box as="li" data-component="SegmentedControlItem" data-selected={selected} sx={sxProp}>
      {/* TODO: Once the tooltip remediations are resolved (especially https://github.com/github/primer/issues/1909) - bring it back */}
      <button aria-label={ariaLabel} aria-current={selected} data-component="SegmentedControlButton" {...rest}>
        <span className="segmentedControl-content">
          <Icon />
        </span>
      </button>
    </Box>
  )
}

export default SegmentedControlIconButton
