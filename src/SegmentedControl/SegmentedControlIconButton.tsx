import React, {HTMLAttributes} from 'react'
import {IconProps} from '@primer/octicons-react'
import styled from 'styled-components'
import sx, {merge, SxProp} from '../sx'
import getSegmentedControlButtonStyles from './getSegmentedControlStyles'

export type SegmentedControlIconButtonProps = {
  'aria-label': string
  /** The icon that represents the segmented control item */
  icon: React.FunctionComponent<IconProps>
  /** Whether the segment is selected */
  selected?: boolean
} & SxProp &
  HTMLAttributes<HTMLButtonElement>

const SegmentedControlIconButtonStyled = styled.button`
  ${sx};
`

// TODO: get tooltips working:
// - by default, the tooltip shows the `ariaLabel` content
// - allow users to pass custom tooltip text
export const SegmentedControlIconButton: React.FC<SegmentedControlIconButtonProps> = ({
  icon: Icon,
  selected,
  sx: sxProp = {},
  ...rest
}) => {
  const mergedSx = merge(getSegmentedControlButtonStyles({selected, isIconOnly: true}), sxProp as SxProp)

  return (
    <SegmentedControlIconButtonStyled aria-pressed={selected} sx={mergedSx} {...rest}>
      <span className="segmentedControl-content">
        <Icon />
      </span>
    </SegmentedControlIconButtonStyled>
  )
}

export default SegmentedControlIconButton
