import type React from 'react'
import {useRef} from 'react'
import {useMergedRefs} from '../../hooks'
import type {TabListHookProps, TabListHookResult} from './types'

export function useTabList<T extends HTMLElement>(props: TabListHookProps<T>): TabListHookResult<T> {
  const {'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-orientation': ariaOrientation} = props

  const tabListRef = useRef<T>(null)
  const mergedRef = useMergedRefs(tabListRef, props.ref)

  const onKeyDown = (event: React.KeyboardEvent) => {
    const {current: tablist} = tabListRef
    if (tablist === null) {
      return
    }

    const tabs = getFocusableTabs(tablist)

    const getCurrentIndex = () => {
      const activeElement = tablist.ownerDocument.activeElement
      const focusedIndex = activeElement instanceof HTMLElement ? tabs.indexOf(activeElement) : -1
      if (focusedIndex !== -1) {
        return focusedIndex
      }
      return tabs.findIndex(tab => {
        return tab.getAttribute('aria-selected') === 'true'
      })
    }

    const isVertical = ariaOrientation === 'vertical'
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'

    if (event.key === nextKey || event.key === prevKey || event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      event.stopPropagation()
    }

    if (event.key === nextKey) {
      const currentTabIndex = getCurrentIndex()
      if (currentTabIndex === -1) {
        return
      }

      const nextTabIndex = (currentTabIndex + 1) % tabs.length
      tabs[nextTabIndex].focus()
    } else if (event.key === prevKey) {
      const currentTabIndex = getCurrentIndex()
      if (currentTabIndex === -1) {
        return
      }

      const nextTabIndex = (tabs.length + currentTabIndex - 1) % tabs.length
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
      ref: mergedRef,
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
