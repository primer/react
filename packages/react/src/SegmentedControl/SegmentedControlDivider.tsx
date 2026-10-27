import type React from 'react'
import type {FCWithSlotMarker} from '../utils/types'

export type SegmentedControlDividerProps = {
  className?: string
  style?: React.CSSProperties
}

const SegmentedControlDivider: FCWithSlotMarker<SegmentedControlDividerProps> = ({className, style}) => (
  <li aria-hidden="true" className={className} data-component="SegmentedControl.Divider" style={style} />
)

SegmentedControlDivider.displayName = 'SegmentedControl.Divider'
SegmentedControlDivider.__SLOT__ = Symbol('SegmentedControl.Divider')

export default SegmentedControlDivider
