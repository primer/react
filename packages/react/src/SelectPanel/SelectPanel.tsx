import {useFeatureFlag} from '../FeatureFlags'
import React from 'react'

import {
  SecondaryActionButton,
  SecondaryActionLink,
  SELECT_PANEL_SLOT,
  isMultiSelectVariant,
  type SelectPanelNextMultiProps,
  type SelectPanelNextSingleProps,
  type SelectPanelProps,
} from './SelectPanel.shared'
import {SelectPanelLegacy} from './SelectPanelLegacy'
import {SelectPanelNext} from './SelectPanelNext'

export type {InitialLoadingType, SelectPanelProps, SelectPanelSecondaryAction} from './SelectPanel.shared'

function SelectPanelRoot(props: SelectPanelProps) {
  const selectPanelNextEnabled = useFeatureFlag('primer_react_select_panel_next')

  if (selectPanelNextEnabled) {
    if (isMultiSelectVariant(props.selected)) {
      const nextProps = {
        ...props,
        mode: 'multi',
      } as SelectPanelNextMultiProps

      return <SelectPanelNext {...nextProps} />
    }

    const nextProps = {
      ...props,
      mode: 'single',
    } as SelectPanelNextSingleProps

    return <SelectPanelNext {...nextProps} />
  }

  return <SelectPanelLegacy {...props} />
}

export const SelectPanel = Object.assign(SelectPanelRoot, {
  __SLOT__: SELECT_PANEL_SLOT,
  SecondaryActionButton,
  SecondaryActionLink,
})
