import type {ButtonHTMLAttributes} from 'react'
import type React from 'react'
import type {IconProps} from '@primer/octicons-react'
import {isElement} from 'react-is'
import type {TooltipDirection} from '../TooltipV2'
import classes from './SegmentedControl.module.css'
import {clsx} from 'clsx'
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
  /** Whether the button is disabled. */
  disabled?: boolean
  /** Whether the button is aria-disabled. */
  'aria-disabled'?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement | HTMLLIElement>

export const SegmentedControlIconButton: React.FC<React.PropsWithChildren<SegmentedControlIconButtonProps>> = ({
  'aria-label': ariaLabel,
  icon: Icon,
  selected,
  className,
  description,
  tooltipDirection,
  disabled,
  'aria-disabled': ariaDisabled,
  ...rest
}) => {
  return (
    <li className={clsx(classes.Item, className)} data-selected={selected || undefined}>
      <Tooltip
        type={description ? undefined : 'label'}
        text={description ? description : ariaLabel}
        direction={tooltipDirection}
      >
        <button
          type="button"
          aria-current={selected}
          // If description is provided, we will use the tooltip to describe the button, so we need to keep the aria-label to label the button.
          aria-label={description ? ariaLabel : undefined}
          aria-disabled={disabled || ariaDisabled || undefined}
          className={clsx(classes.Button, classes.IconButton)}
          {...rest}
        >
          <span className={clsx(classes.Content, 'segmentedControl-content')}>{isElement(Icon) ? Icon : <Icon />}</span>
        </button>
      </Tooltip>
    </li>
  )
}

export default SegmentedControlIconButton
