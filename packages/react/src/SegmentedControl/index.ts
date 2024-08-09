import {Root as SegmentedControlImpl} from './SegmentedControl'
import SegmentedControlButton from './SegmentedControlButton'
import SegmentedControlIconButton from './SegmentedControlIconButton'

SegmentedControlImpl.displayName = 'SegmentedControl'

export const SegmentedControl = Object.assign(SegmentedControlImpl, {
  Button: SegmentedControlButton,
  IconButton: SegmentedControlIconButton,
})
