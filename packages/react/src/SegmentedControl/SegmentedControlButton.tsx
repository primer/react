import type {ButtonHTMLAttributes} from 'react'
import type React from 'react'
import type {IconProps} from '@primer/octicons-react'
import type {SxProp} from '../sx'
import {isElement} from 'react-is'

import classes from './SegmentedControl.module.css'
import {clsx} from 'clsx'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'
import CounterLabel from '../CounterLabel'

export type SegmentedControlButtonProps = {
  /** The visible label rendered in the button */
  children: string
  /** Whether the segment is selected. This is used for controlled `SegmentedControls`, and needs to be updated using the `onChange` handler on `SegmentedControl`. */
  selected?: boolean
  /** Whether the segment is selected. This is used for uncontrolled `SegmentedControls` to pick one `SegmentedControlButton` that is selected on the initial render. */
  defaultSelected?: boolean
  /** The leading icon comes before item label */
  leadingIcon?: React.FunctionComponent<React.PropsWithChildren<IconProps>> | React.ReactElement
  /** Optional counter to display on the right side of the button */
  counter?: number | string
} & SxProp &
  ButtonHTMLAttributes<HTMLButtonElement | HTMLLIElement>

const SegmentedControlButton: React.FC<React.PropsWithChildren<SegmentedControlButtonProps>> = ({
  children,
  leadingIcon: LeadingIcon,
  selected,
  sx: sxProp,
  className,
  // Note: this value is read in the `SegmentedControl` component to determine which button is selected but we do not need to apply it to an underlying element
  defaultSelected: _defaultSelected,
  counter,
  ...rest
}) => {
  return (
    <BoxWithFallback as="li" sx={sxProp} className={clsx(classes.Item)} data-selected={selected ? '' : undefined}>
      <BoxWithFallback
        as="button"
        aria-current={selected}
        className={clsx(classes.Button, className)}
        type="button"
        {...rest}
      >
        <span className={clsx(classes.Content, 'segmentedControl-content')}>
          {LeadingIcon && (
            <div className={classes.LeadingIcon}>{isElement(LeadingIcon) ? LeadingIcon : <LeadingIcon />}</div>
          )}
          <div className={clsx(classes.Text, 'segmentedControl-text')} data-text={children}>
            {children}
          </div>
          {counter !== undefined && (
            <span data-component="counter">
              <CounterLabel>{counter}</CounterLabel>
            </span>
          )}
        </span>
      </BoxWithFallback>
    </BoxWithFallback>
  )
}

export default SegmentedControlButton
