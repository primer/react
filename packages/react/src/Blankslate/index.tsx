import {Blankslate, Visual, Heading, Description, Action, PrimaryAction, SecondaryAction} from './Blankslate'
import type {
  BlankslateProps,
  BlankslateVisualProps,
  BlankslateHeadingProps,
  BlankslateDescriptionProps,
  BlankslateActionProps,
  BlankslatePrimaryActionProps,
  BlankslateSecondaryActionProps,
} from './Blankslate'

const BlankslateContainer = Object.assign(Blankslate, {
  Visual,
  Heading,
  Description,
  Action,
  PrimaryAction,
  SecondaryAction,
})

export {BlankslateContainer as Blankslate}
export type {
  BlankslateProps,
  BlankslateVisualProps,
  BlankslateHeadingProps,
  BlankslateDescriptionProps,
  BlankslateActionProps,
  BlankslatePrimaryActionProps,
  BlankslateSecondaryActionProps,
}
