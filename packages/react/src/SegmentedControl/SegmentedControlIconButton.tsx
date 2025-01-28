import type {ButtonHTMLAttributes} from 'react'
import React from 'react'
import type {IconProps} from '@primer/octicons-react'
import styled from 'styled-components'
import type {SxProp} from '../sx'
import sx, {merge} from '../sx'
import {
  getSegmentedControlButtonStyles,
  getSegmentedControlListItemStyles,
  SEGMENTED_CONTROL_CSS_MODULES_FEATURE_FLAG,
} from './getSegmentedControlStyles'
import Box from '../Box'
import {defaultSxProp} from '../utils/defaultSxProp'
import {isElement} from 'react-is'
import getGlobalFocusStyles from '../internal/utils/getGlobalFocusStyles'
import {useFeatureFlag} from '../FeatureFlags'

import classes from './SegmentedControl.module.css'
import {clsx} from 'clsx'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'

export type SegmentedControlIconButtonProps = {
  'aria-label': string
  /** The icon that represents the segmented control item */
  icon: React.FunctionComponent<React.PropsWithChildren<IconProps>> | React.ReactElement
  /** Whether the segment is selected. This is used for controlled SegmentedControls, and needs to be updated using the onChange handler on SegmentedControl. */
  selected?: boolean
  /** Whether the segment is selected. This is used for uncontrolled SegmentedControls to pick one SegmentedControlButton that is selected on the initial render. */
  defaultSelected?: boolean
} & SxProp &
  ButtonHTMLAttributes<HTMLButtonElement | HTMLLIElement>

const SegmentedControlIconButtonStyled = toggleStyledComponent(
  SEGMENTED_CONTROL_CSS_MODULES_FEATURE_FLAG,
  'button',
  styled.button`
    ${getGlobalFocusStyles('-1px')};
    ${sx};
  `,
)

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
  className,
  ...rest
}) => {
  const enabled = useFeatureFlag(SEGMENTED_CONTROL_CSS_MODULES_FEATURE_FLAG)
  const mergedSx = enabled
    ? sxProp
    : merge(
        {
          width: '32px', // TODO: use primitive `control.medium.size` when it is available
          ...getSegmentedControlListItemStyles(),
        },
        sxProp as SxProp,
      )

  return (
    <Box
      as="li"
      sx={mergedSx}
      className={clsx(enabled && classes.Item, className)}
      data-selected={selected || undefined}
    >
      {/* TODO: Once the tooltip remediations are resolved (especially https://github.com/github/primer/issues/1909) - bring it back */}
      <SegmentedControlIconButtonStyled
        aria-label={ariaLabel}
        aria-current={selected}
        sx={enabled ? undefined : getSegmentedControlButtonStyles({selected})}
        className={clsx(enabled && classes.Button, enabled && classes.IconButton)}
        {...rest}
      >
        <span className={clsx(enabled ? classes.Content : 'segmentedControl-content')}>
          {isElement(Icon) ? Icon : <Icon />}
        </span>
      </SegmentedControlIconButtonStyled>
    </Box>
  )
}

export default SegmentedControlIconButton
