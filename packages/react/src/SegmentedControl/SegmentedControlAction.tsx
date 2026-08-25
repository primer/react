import React, {useContext} from 'react'
import type {ElementType} from 'react'
import {clsx} from 'clsx'
import {ActionList} from '../ActionList'
import {IconButton} from '../Button'
import type {IconButtonProps} from '../Button'
import type {DistributiveOmit} from '../utils/modern-polymorphic'
import type {FCWithSlotMarker} from '../utils/types'
import classes from './SegmentedControl.module.css'
import {SegmentedControlActionContext} from './SegmentedControlActionContext'

type SegmentedControlActionBaseProps = {
  label: string
}

type SegmentedControlIconActionProps = SegmentedControlActionBaseProps &
  DistributiveOmit<IconButtonProps, 'icon' | 'children' | 'aria-label' | 'aria-labelledby' | 'onClick'> & {
    icon: ElementType
    onClick?: () => void
  }
export type SegmentedControlActionProps = SegmentedControlIconActionProps

const SegmentedControlAction: FCWithSlotMarker<SegmentedControlActionProps> = props => {
  const {className, disabled, icon, label, loading, onClick, ...iconButtonProps} = props
  const variant = useContext(SegmentedControlActionContext)

  if (variant === 'menu') {
    return (
      <>
        <ActionList.Divider />
        <ActionList.Item
          role="menuitem"
          className={className}
          disabled={disabled}
          loading={loading}
          onSelect={event => {
            event.preventDefault()
            onClick?.()
          }}
        >
          <ActionList.LeadingVisual>{React.createElement(icon)}</ActionList.LeadingVisual>
          {label}
        </ActionList.Item>
      </>
    )
  }

  return (
    <div className={classes.ActionItem} data-component="SegmentedControl.Action">
      <IconButton
        aria-label={label}
        className={clsx(classes.ActionButton, className)}
        disabled={disabled}
        icon={icon}
        loading={loading}
        onClick={() => onClick?.()}
        variant="invisible"
        {...iconButtonProps}
      />
    </div>
  )
}

SegmentedControlAction.displayName = 'SegmentedControl.Action'

export default SegmentedControlAction

SegmentedControlAction.__SLOT__ = Symbol('SegmentedControl.Action')
