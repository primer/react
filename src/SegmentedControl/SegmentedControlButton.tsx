import React, {HTMLAttributes} from 'react'
import {IconProps} from '@primer/octicons-react'
import styled from 'styled-components'
import {Box} from '..'
import sx, {merge, SxProp} from '../sx'
import {getSegmentedControlButtonStyles} from './getSegmentedControlStyles'

export type SegmentedControlButtonProps = {
  /** The visible label rendered in the button */
  children: string
  /** Whether the segment is selected */
  selected?: boolean
  /** The leading icon comes before item label */
  leadingIcon?: React.FunctionComponent<IconProps>
} & SxProp &
  HTMLAttributes<HTMLButtonElement | HTMLLIElement>

const SegmentedControlButtonStyled = styled.button`
  ${sx};
`

const SegmentedControlButton: React.FC<SegmentedControlButtonProps> = ({
  children,
  leadingIcon: LeadingIcon,
  selected,
  sx: sxProp = {},
  ...rest
}) => {
  const mergedSx = merge(getSegmentedControlButtonStyles({selected, children}), sxProp as SxProp)

  return (
    <SegmentedControlButtonStyled aria-current={selected} sx={mergedSx} {...rest}>
      <span className="segmentedControl-content">
        {LeadingIcon && (
          <Box mr={1}>
            <LeadingIcon />
          </Box>
        )}
        <Box className="segmentedControl-text">{children}</Box>
      </span>
    </SegmentedControlButtonStyled>
  )
}

export default SegmentedControlButton
