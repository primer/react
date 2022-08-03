import React, {HTMLAttributes} from 'react'
import {IconProps} from '@primer/octicons-react'
import styled from 'styled-components'
import sx, {merge, SxProp} from '../sx'
import {
  borderedSegment,
  getSegmentedControlButtonStyles,
  directChildLayoutAdjustments
} from './getSegmentedControlStyles'
import Tooltip from '../Tooltip'

export type SegmentedControlIconButtonProps = {
  'aria-label': string
  /** The icon that represents the segmented control item */
  icon: React.FunctionComponent<React.PropsWithChildren<IconProps>>
  /** Whether the segment is selected. This is used for controlled SegmentedControls, and needs to be updated using the onChange handler on SegmentedControl. */
  selected?: boolean
  /** Whether the segment is selected. This is used for uncontrolled SegmentedControls to pick one SegmentedControlButton that is selected on the initial render. */
  defaultSelected?: boolean
} & SxProp &
  HTMLAttributes<HTMLButtonElement | HTMLLIElement>

const SegmentedControlIconButtonStyled = styled.button`
  ${sx};
`

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
  sx: sxProp = {},
  ...rest
}) => {
  const mergedSx = merge(getSegmentedControlButtonStyles({selected, isIconOnly: true}), sxProp as SxProp)

  return (
    <Tooltip
      text={ariaLabel}
      sx={{
        // Since the element rendered by Tooltip is now the direct child,
        // we need to put these styles on the Tooltip instead of the button.
        ...directChildLayoutAdjustments,
        // The border drawn by the `:after` pseudo-element needs to scoped to the child button
        // because Tooltip uses `:before` and `:after` to render the tooltip.
        ':not(:last-child) button': borderedSegment
      }}
    >
      <SegmentedControlIconButtonStyled aria-pressed={selected} sx={mergedSx} {...rest}>
        <span className="segmentedControl-content">
          <Icon />
        </span>
      </SegmentedControlIconButtonStyled>
    </Tooltip>
  )
}

export default SegmentedControlIconButton
