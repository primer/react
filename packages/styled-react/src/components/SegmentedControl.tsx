/* eslint-disable primer-react/spread-props-first */
import {
  type SegmentedControlProps as PrimerSegmentedControlProps,
  SegmentedControl as PrimerSegmentedControl,
  type SegmentedControlButtonProps as PrimerSegmentedControlButtonProps,
  type SegmentedControlIconButtonProps as PrimerSegmentedControlIconButtonProps,
} from '@primer/react'
import type {PropsWithChildren} from 'react'
import type {SxProp} from '../sx'
import {Box} from './Box'

type SegmentedControlProps = PropsWithChildren<PrimerSegmentedControlProps> & SxProp
type SegmentedControlButtonProps = PropsWithChildren<PrimerSegmentedControlButtonProps> & SxProp
type SegmentedControlIconButtonProps = PropsWithChildren<PrimerSegmentedControlIconButtonProps> & SxProp

const SegmentedControlButton = (props: SegmentedControlButtonProps) => {
  return <Box as={PrimerSegmentedControl.Button} {...props} />
}

const SegmentedControlIconButton = (props: SegmentedControlIconButtonProps) => {
  return <Box as={PrimerSegmentedControl.IconButton} {...props} />
}

const SegmentedControlImpl = (props: SegmentedControlProps) => {
  return <Box as={PrimerSegmentedControl} {...props} />
}

const SegmentedControl = Object.assign(SegmentedControlImpl, {
  __SLOT__: PrimerSegmentedControl.__SLOT__,
  Button: SegmentedControlButton,
  IconButton: SegmentedControlIconButton,
})

SegmentedControlButton.__SLOT__ = PrimerSegmentedControl.Button.__SLOT__
SegmentedControlIconButton.__SLOT__ = PrimerSegmentedControl.IconButton.__SLOT__

export {
  SegmentedControl,
  type SegmentedControlProps,
  type SegmentedControlButtonProps,
  type SegmentedControlIconButtonProps,
}
