import type React from 'react'
import {useRef} from 'react'
import {useMergedRefs, useProvidedRefOrCreate} from '../../hooks'
import {useFeatureFlag} from '../../FeatureFlags'
import type {TabListHookProps, TabListHookResult} from './types'

export function useTabList<T extends HTMLElement>(props: TabListHookProps<T>): TabListHookResult<T> {
  const {'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-orientation': ariaOrientation} = props

  const mergedRefEnabled = useFeatureFlag('primer_react_merged_forwarded_refs')
  const tabListRef = useRef<T>(null)
  const mergedRef = useMergedRefs(tabListRef, props.ref)
  // Feature-flag scaffolding for `primer_react_merged_forwarded_refs`.
  // At graduation: remove the three declarations below, and replace all instances of `readRef` with `tabListRef` and `appliedRef` with `mergedRef`.
  const providedOrCreatedRef = useProvidedRefOrCreate<T>(props.ref as React.RefObject<T | null>)
  const readRef = mergedRefEnabled ? tabListRef : providedOrCreatedRef
  const appliedRef = mergedRefEnabled ? mergedRef : providedOrCreatedRef

  const onKeyDown = (event: React.KeyboardEvent) => {
    const {current: tablist} = readRef
    if (tablist === null) {
      return
    }

    const tabs = getFocusableTabs(tablist)

    const isVertical = ariaOrientation === 'vertical'
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'

    if (event.key === nextKey || event.key === prevKey || event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      event.stopPropagation()
    }

    if (event.key === nextKey) {
      const selectedTabIndex = tabs.findIndex(tab => {
        return tab.getAttribute('aria-selected') === 'true'
      })
      if (selectedTabIndex === -1) {
        return
      }

      const nextTabIndex = (selectedTabIndex + 1) % tabs.length
      tabs[nextTabIndex].focus()
    } else if (event.key === prevKey) {
      const selectedTabIndex = tabs.findIndex(tab => {
        return tab.getAttribute('aria-selected') === 'true'
      })
      if (selectedTabIndex === -1) {
        return
      }

      const nextTabIndex = (tabs.length + selectedTabIndex - 1) % tabs.length
      tabs[nextTabIndex].focus()
    } else if (event.key === 'Home') {
      if (tabs[0]) {
        tabs[0].focus()
      }
    } else if (event.key === 'End') {
      if (tabs.length > 0) {
        tabs[tabs.length - 1].focus()
      }
    }
  }

  return {
    tabListProps: {
      ref: appliedRef,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-orientation': ariaOrientation ?? 'horizontal',
      role: 'tablist',
      onKeyDown,
    },
  }
}

function getFocusableTabs(tablist: HTMLElement): Array<HTMLElement> {
  return Array.from(tablist.querySelectorAll('[role="tab"]:not([aria-disabled])'))
}
