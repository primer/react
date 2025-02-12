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
import type {TooltipDirection} from '../TooltipV2'
import classes from './SegmentedControl.module.css'
import {clsx} from 'clsx'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {Tooltip} from '../TooltipV2'

export type SegmentedControlIconButtonProps = {
  'aria-label': string
  /** The icon that represents the segmented control item */
  icon: React.FunctionComponent<React.PropsWithChildren<IconProps>> | React.ReactElement
  /** Whether the segment is selected. This is used for controlled SegmentedControls, and needs to be updated using the onChange handler on SegmentedControl. */
  selected?: boolean
  /** Whether the segment is selected. This is used for uncontrolled SegmentedControls to pick one SegmentedControlButton that is selected on the initial render. */
  defaultSelected?: boolean
  /** Supplementary description that renders inside tooltip in place of the label.*/
  description?: string
  /** The direction for the tooltip.*/
  tooltipDirection?: TooltipDirection
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

export const SegmentedControlIconButton: React.FC<React.PropsWithChildren<SegmentedControlIconButtonProps>> = ({
  'aria-label': ariaLabel,
  icon: Icon,
  selected,
  sx: sxProp = defaultSxProp,
  className,
  description,
  tooltipDirection,
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

  const tooltipFlagEnabled = useFeatureFlag('primer_react_segmented_control_tooltip')
  if (tooltipFlagEnabled) {
    return (
      <Box
        as="li"
        sx={mergedSx}
        className={clsx(enabled && classes.Item, className)}
        data-selected={selected || undefined}
      >
        <Tooltip
          type={description ? undefined : 'label'}
          text={description ? description : ariaLabel}
          direction={tooltipDirection}
        >
          <SegmentedControlIconButtonStyled
            aria-current={selected}
            // If description is provided, we will use the tooltip to describe the button, so we need to keep the aria-label to label the button.
            aria-label={description ? ariaLabel : undefined}
            sx={enabled ? undefined : getSegmentedControlButtonStyles({selected})}
            className={clsx(enabled && classes.Button, enabled && classes.IconButton)}
            {...rest}
          >
            <span className={clsx(enabled ? classes.Content : 'segmentedControl-content')}>
              {isElement(Icon) ? Icon : <Icon />}
            </span>
          </SegmentedControlIconButtonStyled>
        </Tooltip>
      </Box>
    )
  } else {
    // This can be removed when primer_react_segmented_control_tooltip feature flag is GA-ed.
    return (
      <Box
        as="li"
        sx={mergedSx}
        className={clsx(enabled && classes.Item, className)}
        data-selected={selected || undefined}
      >
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
}

export default SegmentedControlIconButton
