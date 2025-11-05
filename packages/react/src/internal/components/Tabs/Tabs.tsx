import React, {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  type ElementRef,
  type PropsWithChildren,
} from 'react'
import useIsomorphicLayoutEffect from '../../../utils/useIsomorphicLayoutEffect'
import {useControllableState} from '../../../hooks/useControllableState'
import {useProvidedRefOrCreate} from '../../../hooks'

type TabsProps = PropsWithChildren<{
  /**
   * Specify the selected tab
   */
  value?: string

  /**
   * Specify the default selected tab
   */
  defaultValue: string

  /**
   * Provide an optional callback that is called when the selected tab changes
   */
  onValueChange?: ({value}: {value: string}) => void
}>

function Tabs({children, defaultValue, onValueChange, value}: TabsProps) {
  const groupId = useId()

  const [selectedValue, setSelectedValue] = useControllableState({
    name: 'tab-selection',
    defaultValue,
    value,
  })

  const savedOnValueChange = React.useRef(onValueChange)
  const contextValue: TabsContextValue = useMemo(() => {
    return {
      groupId,
      selectedValue,
      selectTab(value: string) {
        setSelectedValue(value)
        savedOnValueChange.current?.({value})
      },
    }
  }, [groupId, selectedValue, setSelectedValue])

  useIsomorphicLayoutEffect(() => {
    savedOnValueChange.current = onValueChange
  }, [onValueChange])

  return <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>
}

type Label = {
  'aria-label': string
}

type LabelledBy = {
  'aria-labelledby': string
}

type Labelled = Label | LabelledBy
type TabListProps = Labelled & React.HTMLAttributes<HTMLElement>

export function useTabList<T extends HTMLElement>(
  props: TabListProps & {
    /** Optional ref to use for the tablist. If none if provided, one will be generated automatically */
    ref?: React.RefObject<T>
  },
): {
  tabListProps: Pick<React.HTMLProps<HTMLElement>, 'aria-label' | 'aria-labelledby'> &
    Required<Pick<React.HTMLProps<HTMLElement>, 'aria-orientation' | 'onKeyDown'>> & {
      ref: React.RefObject<T>
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

    event.preventDefault()
    const tabs = getFocusableTabs(tablist)

    const isVertical = ariaOrientation === 'vertical'
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'

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

function TabList({children, ...rest}: TabListProps) {
  const {tabListProps} = useTabList<HTMLDivElement>(rest)

  return (
    <div {...rest} {...tabListProps}>
      {children}
    </div>
  )
}

function getFocusableTabs(tablist: HTMLElement): Array<HTMLElement> {
  return Array.from(tablist.querySelectorAll('[role="tab"]:not([disabled])'))
}

type TabProps = React.ComponentPropsWithoutRef<'button'> & {
  /**
   * Specify whether the tab is disabled
   */
  disabled?: boolean

  /**
   * Provide a value that uniquely identities the tab. This should mirror the
   * value provided to the corresponding TabPanel
   */
  value: string
}

/**
 * A custom hook that provides the props needed for a tab component.
 * The props returned should be spread onto the component (typically a button) with the `role=tab`, under a `tablist`.
 * @param props The props for the tab component.
 * @returns The props needed for the tab component.
 */
export function useTab(props: Pick<TabProps, 'disabled' | 'value'>): {
  tabProps: Pick<
    React.HTMLProps<HTMLElement>,
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

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      tabs.selectTab(value)
    }
  }

  function onMouseDown(event: React.MouseEvent) {
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
      'aria-controls': panelId,
      'aria-disabled': disabled,
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

const Tab = React.forwardRef<ElementRef<'button'>, TabProps>(function Tab(props, forwardRef) {
  const {children, disabled, value, ...rest} = props
  const {tabProps} = useTab({disabled, value})

  return (
    <button
      {...rest}
      {...tabProps}
      ref={forwardRef}
      onKeyDown={composeEventHandlers(rest.onKeyDown, tabProps.onKeyDown)}
      onMouseDown={composeEventHandlers(rest.onMouseDown, tabProps.onMouseDown)}
      onFocus={composeEventHandlers(rest.onFocus, tabProps.onFocus)}
      type="button"
    >
      {children}
    </button>
  )
})

type TabPanelProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * Provide a value that uniquely identities the tab panel. This should mirror
   * the value set for the corresponding tab
   */
  value: string
}

export function useTabPanel(props: Pick<TabPanelProps, 'value'>) {
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

function TabPanel({children, value, ...rest}: TabPanelProps) {
  const {tabPanelProps} = useTabPanel({value})

  return (
    <div {...rest} {...tabPanelProps}>
      {children}
    </div>
  )
}

type TabsContextValue = {
  groupId: string
  selectedValue: string
  selectTab(value: string): void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs(): TabsContextValue {
  const context = useContext(TabsContext)
  if (context) {
    return context
  }
  throw new Error('Component must be used within a <Tabs> component')
}

type Handler<E> = (event: E) => void

function composeEventHandlers<E>(...handlers: Array<Handler<E> | null | undefined>) {
  return function handleEvent(event: E) {
    for (const handler of handlers) {
      handler?.(event)
      if ((event as unknown as Event).defaultPrevented) {
        break
      }
    }
  }
}

export {Tabs, TabList, Tab, TabPanel}
export type {TabsProps, TabListProps, TabProps, TabPanelProps}
