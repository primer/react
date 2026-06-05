import {createContext, useContext, type AriaAttributes} from 'react'
import type React from 'react'
import {useProvidedRefOrCreate} from '../../hooks'

export type TabsContextValue = {
  groupId: string
  selectedValue: string
  selectTab(value: string): void
}

export const TabsContext = createContext<TabsContextValue | null>(null)

export function useTabs(): TabsContextValue {
  const context = useContext(TabsContext)
  if (context) {
    return context
  }
  throw new Error('Component must be used within a <Tabs> component')
}

type Label = {
  'aria-label': string
}

type LabelledBy = {
  'aria-labelledby': string
}

type Labelled = Label | LabelledBy
export type TabListProps = Labelled & React.HTMLAttributes<HTMLElement>

export function useTabList<T extends HTMLElement>(
  props: TabListProps & {
    /** Optional ref to use for the tablist. If none is provided, one will be generated automatically */
    ref?: React.RefObject<T>
  },
): {
  /** Props to be spread onto the tablist element */
  tabListProps: {
    onKeyDown: React.KeyboardEventHandler<T>
    'aria-orientation': AriaAttributes['aria-orientation']
    'aria-label': AriaAttributes['aria-label']
    'aria-labelledby': AriaAttributes['aria-labelledby']
    ref: React.RefObject<T | null>
    role: 'tablist'
  }
} {
  const {'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-orientation': ariaOrientation} = props

  const ref = useProvidedRefOrCreate(props.ref)

  const onKeyDown = (event: React.KeyboardEvent) => {
    const {current: tablist} = ref
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
      ref,
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

export type TabProps = React.ComponentPropsWithoutRef<'button'> & {
  /**
   * Specify whether the tab is disabled
   */
  disabled?: boolean

  /**
   * Provide a value that uniquely identifies the tab. This should mirror the
   * value provided to the corresponding TabPanel
   */
  value: string
}

/**
 * A custom hook that provides the props needed for a tab component.
 * The props returned should be spread onto the component (typically a button) with the `role=tab`, under a `tablist`.
 */
export function useTab<T extends HTMLElement>(
  props: Pick<TabProps, 'disabled' | 'value'>,
): {
  /** Props to be spread onto the tab component */
  tabProps: Pick<
    React.HTMLProps<T>,
    'aria-controls' | 'aria-disabled' | 'aria-selected' | 'id' | 'tabIndex' | 'onKeyDown' | 'onMouseDown' | 'onFocus'
  > & {
    role: 'tab'
  }
} {
  const {disabled, value} = props
  const tabs = useTabs()
  const selected = tabs.selectedValue === value
  const id = `${tabs.groupId}-tab-${value}`
  const panelId = `${tabs.groupId}-panel-${value}`

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
      tabIndex: selected ? 0 : -1,
    },
  }
}

export type TabPanelProps = {
  /**
   * Provide a value that uniquely identifies the tab panel. This should mirror
   * the value set for the corresponding tab
   */
  value: string
}

/** Utility hook for tab panels */
export function useTabPanel<T extends HTMLElement>(
  props: TabPanelProps,
): {
  /** Props to be spread onto the tabpanel component */
  tabPanelProps: Pick<React.HTMLProps<T>, 'aria-labelledby' | 'id' | 'hidden'> & {
    /**
     * An identifier to aid in styling when this panel is selected & active
     */
    'data-selected': string | undefined
    role: 'tabpanel'
  }
} {
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
