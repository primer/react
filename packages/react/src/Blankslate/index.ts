import {Blankslate as BlankslateImpl, Visual, Heading, Description, PrimaryAction, SecondaryAction} from './Blankslate'
import type {
  BlankslateProps,
  VisualProps,
  HeadingProps,
  DescriptionProps,
  PrimaryActionProps,
  SecondaryActionProps,
} from './Blankslate'

export const Blankslate = Object.assign(BlankslateImpl, {
  Visual,
  Heading,
  Description,
  PrimaryAction,
  SecondaryAction,
})

export type {BlankslateProps, VisualProps, HeadingProps, DescriptionProps, PrimaryActionProps, SecondaryActionProps}
