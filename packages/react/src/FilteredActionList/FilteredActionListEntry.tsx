import React from 'react'
import type {FilteredActionListProps} from './FilteredActionList'
import {FilteredActionList as WithDeprecatedActionList} from './FilteredActionList'
import {FilteredActionList as WithStableActionList} from './FilteredActionListWithModernActionList'
import {useFeatureFlag} from '../FeatureFlags'

export function FilteredActionList(props: FilteredActionListProps): JSX.Element {
  const enabled = useFeatureFlag('primer_react_select_panel_modern_action_list')

  if (enabled) return <WithStableActionList {...props} />
  else return <WithDeprecatedActionList {...props} />
}

FilteredActionList.displayName = 'FilteredActionList'

export type {FilteredActionListProps}
