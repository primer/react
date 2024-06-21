import type {ButtonHTMLAttributes} from 'react'
import React from 'react'
import type {IconProps} from '@primer/octicons-react'
import styled from 'styled-components'
import type {SxProp} from '../sx'
import sx, {merge} from '../sx'
import {getSegmentedControlButtonStyles, getSegmentedControlListItemStyles} from './getSegmentedControlStyles'
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
  sx: sxProp = defaultSxProp,
  ...rest
}) => {
  const mergedSx = merge(
    {
      width: '32px', // TODO: use primitive `control.medium.size` when it is available
      ...getSegmentedControlListItemStyles(),
    },
    sxProp as SxProp,
  )

  return (
    <Box as="li" sx={mergedSx}>
      {/* TODO: Once the tooltip remediations are resolved (especially https://github.com/github/primer/issues/1909) - bring it back */}
      <SegmentedControlIconButtonStyled
        aria-label={ariaLabel}
        aria-current={selected}
        sx={getSegmentedControlButtonStyles({selected, isIconOnly: true})}
        {...rest}
      >
        <span className="segmentedControl-content">
          <Icon />
        </span>
      </SegmentedControlIconButtonStyled>
    </Box>
  )
}

export default SegmentedControlIconButton
