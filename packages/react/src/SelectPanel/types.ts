import type {ItemInput} from '../FilteredActionList'

export interface SelectPanelSingleSelection {
  selected: ItemInput | undefined
  onSelectedChange: (selected: ItemInput | undefined) => void
}

export interface SelectPanelMultiSelection {
  selected: ItemInput[]
  onSelectedChange: (selected: ItemInput[]) => void
}

export type InitialLoadingType = 'spinner' | 'skeleton'
export type SelectPanelSecondaryAction =
  | React.ReactElement<typeof SecondaryButton>
  | React.ReactElement<typeof SecondaryLink>
