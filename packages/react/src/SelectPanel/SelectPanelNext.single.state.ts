import type {ItemInput} from '../FilteredActionList'

export function getInitialSingleIntermediateSelected({
  isSingleSelectModal,
  selected,
}: {
  isSingleSelectModal: boolean
  selected: ItemInput | undefined
}) {
  if (!isSingleSelectModal) {
    return undefined
  }

  return selected
}

export function getSyncedSingleIntermediateSelected({
  isSingleSelectModal,
  selected,
}: {
  isSingleSelectModal: boolean
  selected: ItemInput | undefined
}) {
  if (!isSingleSelectModal) {
    return undefined
  }

  return selected
}
