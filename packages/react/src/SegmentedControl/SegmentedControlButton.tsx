import type {ButtonHTMLAttributes} from 'react'
import type React from 'react'
import type {IconProps} from '@primer/octicons-react'
import {isElement} from 'react-is'

import classes from './SegmentedControl.module.css'
import {clsx} from 'clsx'
import CounterLabel from '../CounterLabel'
import type {FCWithSlotMarker} from '../utils/types'

export type SegmentedControlButtonProps = {
  /** The visible label rendered in the button */
  children: string
  /** Whether the segment is selected. This is used for controlled `SegmentedControls`, and needs to be updated using the `onChange` handler on `SegmentedControl`. */
  selected?: boolean
  /** Whether the segment is selected. This is used for uncontrolled `SegmentedControls` to pick one `SegmentedControlButton` that is selected on the initial render. */
  defaultSelected?: boolean
  /** The leading visual comes before item label */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leadingVisual?: React.FunctionComponent<React.PropsWithChildren<IconProps>> | React.ReactElement<any>
  /** @deprecated Use `leadingVisual` instead. The leading icon comes before item label */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leadingIcon?: React.FunctionComponent<React.PropsWithChildren<IconProps>> | React.ReactElement<any>
  /** Applies `aria-disabled` to the button. This will disable certain functionality, such as `onClick` events. */
  disabled?: boolean
  /** Optional counter to display on the right side of the button */
  count?: number | string
} & ButtonHTMLAttributes<HTMLButtonElement | HTMLLIElement>

const SegmentedControlButton: FCWithSlotMarker<React.PropsWithChildren<SegmentedControlButtonProps>> = ({
  children,
  leadingVisual,
  leadingIcon,
  selected,
  className,
  disabled,
  // Note: this value is read in the `SegmentedControl` component to determine which button is selected but we do not need to apply it to an underlying element
  defaultSelected: _defaultSelected,
  count,
  ...props
}) => {
  const {'aria-disabled': ariaDisabled, ...rest} = props
  // Use leadingVisual if provided, otherwise fall back to leadingIcon for backwards compatibility
  const LeadingVisual = leadingVisual ?? leadingIcon

  return (
    <li className={clsx(classes.Item)} data-selected={selected ? '' : undefined}>
      <button
        aria-current={selected}
        aria-disabled={disabled || ariaDisabled || undefined}
        className={clsx(classes.Button, className)}
        type="button"
        {...rest}
      >
        <span className={clsx(classes.Content, 'segmentedControl-content')}>
          {LeadingVisual && (
            <div className={classes.LeadingIcon}>{isElement(LeadingVisual) ? LeadingVisual : <LeadingVisual />}</div>
          )}
          <div className={clsx(classes.Text, 'segmentedControl-text')} data-text={children}>
            {children}
          </div>
          {count !== undefined && (
            <span className={classes.Counter}>
              <CounterLabel>{count}</CounterLabel>
            </span>
          )}
        </span>
      </button>
    </li>
  )
}

export default SegmentedControlButton

SegmentedControlButton.__SLOT__ = Symbol('SegmentedControl.Button')
