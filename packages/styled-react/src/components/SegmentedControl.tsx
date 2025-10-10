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
  Button: SegmentedControlButton,
  IconButton: SegmentedControlIconButton,
})

// @ts-ignore - TypeScript doesn't know about the __SLOT__ prop
SegmentedControl.__SLOT__ = 'SegmentedControl'
// @ts-ignore - TypeScript doesn't know about the __SLOT__ prop
SegmentedControl.Button.__SLOT__ = 'SegmentedControl.Button'
// @ts-ignore - TypeScript doesn't know about the __SLOT__ prop
SegmentedControl.IconButton.__SLOT__ = 'SegmentedControl.IconButton'

export {
  SegmentedControl,
  type SegmentedControlProps,
  type SegmentedControlButtonProps,
  type SegmentedControlIconButtonProps,
}
