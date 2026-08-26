import React, {useContext} from 'react'
import type {ElementType} from 'react'
import {ActionList} from '../ActionList'
import {IconButton} from '../Button'
import type {FCWithSlotMarker} from '../utils/types'
import classes from './SegmentedControl.module.css'
import {SegmentedControlActionContext} from './SegmentedControlActionContext'

export interface SegmentedControlActionProps {
  label: string
  icon: ElementType
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

interface SegmentedControlMenuActionProps {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLElement>) => void
  'aria-disabled'?: boolean
  'aria-labelledby'?: string
  'aria-describedby'?: string
  className?: string
  role?: string
  tabIndex?: number
}

const SegmentedControlMenuAction: React.FC<SegmentedControlMenuActionProps> = ({children, ...props}) => (
  <div {...props} data-component="SegmentedControl.Action">
    {children}
  </div>
)

const SegmentedControlAction: FCWithSlotMarker<SegmentedControlActionProps> = props => {
  const {disabled, icon, label, loading, onClick} = props
  const variant = useContext(SegmentedControlActionContext)

  if (variant === 'menu') {
    return (
      <>
        <ActionList.Divider />
        <ActionList.Item
          role="menuitem"
          disabled={disabled}
          loading={loading}
          _PrivateItemWrapper={SegmentedControlMenuAction}
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
        {...iconButtonProps}
        aria-label={label}
        className={classes.ActionButton}
        disabled={disabled}
        icon={icon}
        loading={loading}
        onClick={() => onClick?.()}
        variant="invisible"
      />
    </div>
  )
}

SegmentedControlAction.displayName = 'SegmentedControl.Action'

export default SegmentedControlAction

SegmentedControlAction.__SLOT__ = Symbol('SegmentedControl.Action')
