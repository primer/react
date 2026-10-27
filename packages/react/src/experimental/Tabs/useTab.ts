import type React from 'react'
import type {TabHookResult, TabProps} from './types'
import {useTabs} from './useTabs'

/**
 * A custom hook that provides the props needed for a tab component.
 * The props returned should be spread onto the component (typically a button) with the `role=tab`, under a `tablist`.
 */
export function useTab<T extends HTMLElement>(props: Pick<TabProps, 'disabled' | 'value'>): TabHookResult<T> {
  const {disabled, value} = props
  const tabs = useTabs()
  const selected = tabs.selectedValue === value
  const id = `${tabs.groupId}-tab-${value}`
  const panelId = `${tabs.groupId}-panel-${value}`

  const isTabStop =
    tabs.activationMode === 'manual' && tabs.focusedValue !== undefined ? tabs.focusedValue === value : selected

  function onKeyDown(event: React.KeyboardEvent<T>) {
    if (event.key === ' ' || event.key === 'Enter') {
      tabs.selectTab(value)
    }
  }

  function onMouseDown(event: React.MouseEvent<T>) {
    if (!disabled && event.button === 0 && event.ctrlKey === false) {
      tabs.selectTab(value)
    } else {
      event.preventDefault()
    }
  }

  function onFocus() {
    if (tabs.activationMode === 'manual') {
      if (!disabled) {
        tabs.focusTab(value)
      }
      return
    }
    if (!selected && !disabled) {
      tabs.selectTab(value)
    }
  }

  return {
    tabProps: {
      'aria-disabled': disabled ? true : undefined,
      'aria-controls': panelId,
      'aria-selected': selected,
      onKeyDown,
      onMouseDown,
      onFocus,
      id,
      role: 'tab',
      tabIndex: isTabStop ? 0 : -1,
    },
  }
}
