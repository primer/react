import {useFeatureFlag} from '../FeatureFlags'
import React from 'react'

import {
  SecondaryActionButton,
  SecondaryActionLink,
  SELECT_PANEL_SLOT,
  isMultiSelectProps,
  type SelectPanelProps,
} from './SelectPanel.shared'
import {SelectPanelLegacy} from './SelectPanelLegacy'
import {SelectPanelNext} from './SelectPanelNext'

export type {InitialLoadingType, SelectPanelProps, SelectPanelSecondaryAction} from './SelectPanel.shared'

function SelectPanelRoot(props: SelectPanelProps) {
  const selectPanelNextEnabled = useFeatureFlag('primer_react_select_panel_next')

  if (selectPanelNextEnabled) {
    if (isMultiSelectProps(props)) {
      return <SelectPanelNext {...props} mode="multi" />
    }

    return <SelectPanelNext {...props} mode="single" />
  }

  return <SelectPanelLegacy {...props} />
}

export const SelectPanel = Object.assign(SelectPanelRoot, {
  __SLOT__: SELECT_PANEL_SLOT,
  SecondaryActionButton,
  SecondaryActionLink,
})
