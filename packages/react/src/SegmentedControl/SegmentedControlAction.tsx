import type {ElementType} from 'react'
import {IconButton} from '../Button'
import type {IconButtonProps} from '../Button'
import type {DistributiveOmit} from '../utils/modern-polymorphic'
import type {FCWithSlotMarker} from '../utils/types'
import classes from './SegmentedControl.module.css'

type SegmentedControlActionBaseProps = {
  label: string
}

type SegmentedControlIconActionProps = SegmentedControlActionBaseProps &
  DistributiveOmit<IconButtonProps, 'icon' | 'children' | 'aria-label' | 'aria-labelledby'> & {
    icon: ElementType
  }
export type SegmentedControlActionProps = SegmentedControlIconActionProps

const SegmentedControlAction: FCWithSlotMarker<SegmentedControlActionProps> = props => {
  const {icon, label, ...iconButtonProps} = props

  return (
    <div className={classes.ActionItem} data-component="SegmentedControl.Action">
      <IconButton aria-label={label} icon={icon} variant="invisible" {...iconButtonProps} />
    </div>
  )
}

SegmentedControlAction.displayName = 'SegmentedControl.Action'

export default SegmentedControlAction

SegmentedControlAction.__SLOT__ = Symbol('SegmentedControl.Action')
