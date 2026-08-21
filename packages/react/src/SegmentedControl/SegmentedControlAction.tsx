import {PlusIcon} from '@primer/octicons-react'
import type {ElementType} from 'react'
import {IconButton} from '../Button'
import type {IconButtonProps} from '../Button'
import type {DistributiveOmit} from '../utils/modern-polymorphic'
import type {FCWithSlotMarker} from '../utils/types'
import classes from './SegmentedControl.module.css'

export type SegmentedControlActionProps = DistributiveOmit<IconButtonProps, 'icon'> & {
  icon?: ElementType
}

const SegmentedControlAction: FCWithSlotMarker<SegmentedControlActionProps> = ({icon = PlusIcon, ...props}) => {
  return (
    <li className={classes.PlusItem} data-component="SegmentedControl.Action">
      <IconButton icon={icon} variant="invisible" {...props} />
    </li>
  )
}

SegmentedControlAction.displayName = 'SegmentedControl.Action'

export default SegmentedControlAction

SegmentedControlAction.__SLOT__ = Symbol('SegmentedControl.Action')
