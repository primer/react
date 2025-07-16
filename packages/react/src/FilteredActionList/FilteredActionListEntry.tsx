import type {FilteredActionListProps} from './FilteredActionListWithDeprecatedActionList'
import {FilteredActionList as WithDeprecatedActionList} from './FilteredActionListWithDeprecatedActionList'
import {FilteredActionList as WithStableActionList} from './FilteredActionListWithModernActionList'
import {useFeatureFlag} from '../FeatureFlags'

export function FilteredActionList({onListContainerRefChanged, ...props}: FilteredActionListProps) {
  const enabled = useFeatureFlag('primer_react_select_panel_with_modern_action_list')

  if (enabled) return <WithStableActionList {...props} />
  else return <WithDeprecatedActionList onListContainerRefChanged={onListContainerRefChanged} {...props} />
}

FilteredActionList.displayName = 'FilteredActionList'

export type {FilteredActionListProps}
