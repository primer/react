import type {TabPanelHookResult, TabPanelProps} from './types'
import {useTabs} from './useTabs'

/** Utility hook for tab panels */
export function useTabPanel<T extends HTMLElement>(props: TabPanelProps): TabPanelHookResult<T> {
  const {value} = props
  const tabs = useTabs()
  const id = `${tabs.groupId}-panel-${value}`
  const tabId = `${tabs.groupId}-tab-${value}`

  return {
    tabPanelProps: {
      'aria-labelledby': tabId,
      'data-selected': tabs.selectedValue === value ? '' : undefined,
      id,
      hidden: tabs.selectedValue !== value,
      role: 'tabpanel',
    },
  }
}
