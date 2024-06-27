import {SegmentedControl as SegmentedControlImpl} from './SegmentedControl'
import {SegmentedControlButton} from './SegmentedControlButton'
import {SegmentedControlIconButton} from './SegmentedControlIconButton'

export const SegmentedControl = Object.assign(SegmentedControlImpl, {
  Button: SegmentedControlButton,
  IconButton: SegmentedControlIconButton,
})
