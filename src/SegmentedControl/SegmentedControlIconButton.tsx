import React, {ButtonHTMLAttributes} from 'react'
import {IconProps} from '@primer/octicons-react'
import styled from 'styled-components'
import sx, {merge, SxProp} from '../sx'
import {getSegmentedControlButtonStyles, getSegmentedControlListItemStyles} from './getSegmentedControlStyles'
import Tooltip from '../Tooltip'
import Box from '../Box'

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
  const mergedSx = merge(
    {
      width: '32px', // TODO: use primitive `control.medium.size` when it is available
      ...getSegmentedControlListItemStyles()
    },
    sxProp as SxProp
  )

  return (
    <Box as="li" sx={mergedSx}>
      <Tooltip text={ariaLabel}>
        <SegmentedControlIconButtonStyled
          aria-pressed={selected}
          sx={getSegmentedControlButtonStyles({selected, isIconOnly: true})}
          {...rest}
        >
          <span className="segmentedControl-content">
            <Icon />
          </span>
        </SegmentedControlIconButtonStyled>
      </Tooltip>
    </Box>
  )
}

export default SegmentedControlIconButton
