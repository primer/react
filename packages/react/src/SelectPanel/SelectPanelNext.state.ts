import type {ItemInput} from '../FilteredActionList'

import type {SelectPanelProps} from './SelectPanel.shared'
import {toSelectedItemArray} from './SelectPanel.shared'

export interface SelectPanelNextState {
  availablePanelHeight?: number
  dataLoadedOnce: boolean
  internalLoading: boolean
  keyboardVisible: boolean
  selectedOnSort: ItemInput[]
}

export type SelectPanelNextAction =
  | {type: 'mark-loaded'}
  | {type: 'reset-sort'; selectedItems: ItemInput[]}
  | {type: 'set-internal-loading'; value: boolean}
  | {type: 'set-keyboard-visibility'; keyboardVisible: boolean; availablePanelHeight?: number}
  | {type: 'sync-open-state'; selectedItems: ItemInput[]}

export function createInitialSelectPanelNextState(args: {
  selected: SelectPanelProps['selected']
}): SelectPanelNextState {
  return {
    dataLoadedOnce: false,
    internalLoading: false,
    selectedOnSort: toSelectedItemArray(args.selected),
    keyboardVisible: false,
    availablePanelHeight: undefined,
  }
}

export function selectPanelNextReducer(
  state: SelectPanelNextState,
  action: SelectPanelNextAction,
): SelectPanelNextState {
  switch (action.type) {
    case 'mark-loaded':
      return {
        ...state,
        dataLoadedOnce: true,
        internalLoading: false,
      }
    case 'reset-sort':
      return {
        ...state,
        selectedOnSort: action.selectedItems,
      }
    case 'set-internal-loading':
      return {
        ...state,
        internalLoading: action.value,
      }
    case 'set-keyboard-visibility':
      return {
        ...state,
        keyboardVisible: action.keyboardVisible,
        availablePanelHeight: action.availablePanelHeight,
      }
    case 'sync-open-state':
      return {
        ...state,
        selectedOnSort: action.selectedItems,
      }
    default:
      return state
  }
}
