import type {ButtonHTMLAttributes} from 'react'
import React from 'react'
import type {IconProps} from '@primer/octicons-react'
import styled from 'styled-components'
import Box from '../Box'
import type {SxProp} from '../sx'
import sx, {merge} from '../sx'
import {getSegmentedControlButtonStyles, getSegmentedControlListItemStyles} from './getSegmentedControlStyles'
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

const SegmentedControlButtonStyled = styled.button`
  ${sx};
`

const SegmentedControlButton: React.FC<React.PropsWithChildren<SegmentedControlButtonProps>> = ({
  children,
  leadingIcon: LeadingIcon,
  selected,
  sx: sxProp = defaultSxProp,
  ...rest
}) => {
  const mergedSx = merge(getSegmentedControlListItemStyles(), sxProp as SxProp)

  return (
    <Box as="li" sx={mergedSx}>
      <SegmentedControlButtonStyled
        aria-current={selected}
        sx={getSegmentedControlButtonStyles({selected, children})}
        type="button"
        {...rest}
      >
        <span className="segmentedControl-content">
          {LeadingIcon && (
            <Box mr={1}>
              <LeadingIcon />
            </Box>
          )}
          <Box className="segmentedControl-text">{children}</Box>
        </span>
      </SegmentedControlButtonStyled>
    </Box>
  )
}

export default SegmentedControlButton
