import type {ButtonHTMLAttributes} from 'react'
import React from 'react'
import type {IconProps} from '@primer/octicons-react'
import styled from 'styled-components'
import Box from '../Box'
import type {SxProp} from '../sx'
import sx, {merge} from '../sx'
import {
  getSegmentedControlButtonStyles,
  getSegmentedControlListItemStyles,
  SEGMENTED_CONTROL_CSS_MODULES_FEATURE_FLAG,
} from './getSegmentedControlStyles'
import {defaultSxProp} from '../utils/defaultSxProp'
import {isElement} from 'react-is'
import getGlobalFocusStyles from '../internal/utils/getGlobalFocusStyles'
import {useFeatureFlag} from '../FeatureFlags'

import classes from './SegmentedControl.module.css'
import {clsx} from 'clsx'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'

export type SegmentedControlButtonProps = {
  /** The visible label rendered in the button */
  children: string
  /** Whether the segment is selected. This is used for controlled `SegmentedControls`, and needs to be updated using the `onChange` handler on `SegmentedControl`. */
  selected?: boolean
  /** Whether the segment is selected. This is used for uncontrolled `SegmentedControls` to pick one `SegmentedControlButton` that is selected on the initial render. */
  defaultSelected?: boolean
  /** The leading icon comes before item label */
  leadingIcon?: React.FunctionComponent<React.PropsWithChildren<IconProps>> | React.ReactElement
} & SxProp &
  ButtonHTMLAttributes<HTMLButtonElement | HTMLLIElement>

const SegmentedControlButtonStyled = toggleStyledComponent(
  SEGMENTED_CONTROL_CSS_MODULES_FEATURE_FLAG,
  'button',
  styled.button`
    ${getGlobalFocusStyles('-1px')};
    ${sx};
  `,
)

const SegmentedControlButton: React.FC<React.PropsWithChildren<SegmentedControlButtonProps>> = ({
  children,
  leadingIcon: LeadingIcon,
  selected,
  sx: sxProp = defaultSxProp,
  className,
  ...rest
}) => {
  const enabled = useFeatureFlag(SEGMENTED_CONTROL_CSS_MODULES_FEATURE_FLAG)
  const mergedSx = enabled ? sxProp : merge(getSegmentedControlListItemStyles(), sxProp as SxProp)

  return (
    <Box as="li" sx={mergedSx} className={clsx(enabled && classes.Item)} data-selected={selected || undefined}>
      <SegmentedControlButtonStyled
        aria-current={selected}
        sx={enabled ? undefined : getSegmentedControlButtonStyles({selected, children})}
        className={clsx(enabled && classes.Button, className)}
        type="button"
        {...rest}
      >
        <span className={clsx(enabled ? classes.Content : 'segmentedControl-content')}>
          {LeadingIcon && <Box mr={1}>{isElement(LeadingIcon) ? LeadingIcon : <LeadingIcon />}</Box>}
          <Box className={clsx(enabled ? classes.Text : 'segmentedControl-text')} data-text={children}>
            {children}
          </Box>
        </span>
      </SegmentedControlButtonStyled>
    </Box>
  )
}

export default SegmentedControlButton
