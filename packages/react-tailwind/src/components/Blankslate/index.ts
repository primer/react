import {
  Blankslate as BlankslateRoot,
  BlankslateDescription,
  BlankslateHeading,
  BlankslatePrimaryAction,
  BlankslateSecondaryAction,
  BlankslateVisual,
} from './Blankslate'

export const Blankslate = Object.assign(BlankslateRoot, {
  Description: BlankslateDescription,
  Heading: BlankslateHeading,
  PrimaryAction: BlankslatePrimaryAction,
  SecondaryAction: BlankslateSecondaryAction,
  Visual: BlankslateVisual,
})

export {
  BlankslateDescription,
  BlankslateHeading,
  BlankslatePrimaryAction,
  BlankslateSecondaryAction,
  BlankslateVisual,
  type BlankslateHeadingProps,
  type BlankslateProps,
} from './Blankslate'
