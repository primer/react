import {Blankslate, Visual, Heading, Description, PrimaryAction, SecondaryAction} from './Blankslate'
import type {
  BlankslateProps,
  BlankslateVisualProps,
  BlankslateHeadingProps,
  BlankslateDescriptionProps,
  BlankslatePrimaryActionProps,
  BlankslateSecondaryActionProps,
} from './Blankslate'

const BlankslateContainer = Object.assign(Blankslate, {
  Visual,
  Heading,
  Description,
  PrimaryAction,
  SecondaryAction,
})

export {BlankslateContainer as Blankslate}
export type {
  BlankslateProps,
  BlankslateVisualProps,
  BlankslateHeadingProps,
  BlankslateDescriptionProps,
  BlankslatePrimaryActionProps,
  BlankslateSecondaryActionProps,
}
