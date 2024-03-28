import React, {type ElementRef, createContext} from 'react'
import {useControllableState} from '../hooks/useControllableState'
import {composeEventHandlers} from '../internal/utils/composeEventHandlers'

type TabsProps = React.PropsWithChildren<{
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

function Tabs({children, defaultValue, value: controlledValue, onValueChange}: TabsProps) {
  const baseId = React.useId()
  const [selectedValue, setSelectedValue] = useControllableState({
    defaultValue,
    value: controlledValue,
    onChange(value) {
      onValueChange?.({value})
    },
  })
  const value: TabsContextValue = React.useMemo(() => {
    return {
      baseId,
      selectedValue,
      selectTab(value: string) {
        setSelectedValue(value)
      },
    }
  }, [selectedValue, setSelectedValue])

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
}

type Label = {
  'aria-label': string
}

type LabelledBy = {
  'aria-labelledby': string
}

type Labelled = Label | LabelledBy

type TabListProps = React.ComponentPropsWithoutRef<'div'> & Labelled

function TabList({'aria-label': label, 'aria-labelledby': labelledBy, children, ...rest}: TabListProps) {
  const ref = React.useRef<ElementRef<'div'>>(null)

  function onKeyDown(event: React.KeyboardEvent) {
    const {current: tablist} = ref
    if (tablist === null) {
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()

      const tabs = getFocusableTabs(tablist)
      const selectedTabIndex = tabs.findIndex(tab => {
        return tab.getAttribute('aria-selected') === 'true'
      })
      if (selectedTabIndex === -1) {
        return
      }

      const nextTabIndex = (selectedTabIndex + 1) % tabs.length
      tabs[nextTabIndex].focus()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()

      const tabs = getFocusableTabs(tablist)
      const selectedTabIndex = tabs.findIndex(tab => {
        return tab.getAttribute('aria-selected') === 'true'
      })
      if (selectedTabIndex === -1) {
        return
      }

      const nextTabIndex = (tabs.length + selectedTabIndex - 1) % tabs.length
      tabs[nextTabIndex].focus()
    } else if (event.key === 'Home') {
      event.preventDefault()
      const tabs = getFocusableTabs(tablist)
      if (tabs[0]) {
        tabs[0].focus()
      }
    } else if (event.key === 'End') {
      event.preventDefault()
      const tabs = getFocusableTabs(tablist)
      if (tabs.length > 0) {
        tabs[tabs.length - 1].focus()
      }
    }
  }

  return (
    <div
      {...rest}
      ref={ref}
      aria-label={label}
      aria-labelledby={labelledBy}
      role="tablist"
      onKeyDown={composeEventHandlers(rest.onKeyDown, onKeyDown)}
    >
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

const Tab = React.forwardRef<ElementRef<'button'>, TabProps>(function Tab(props, forwardRef) {
  const {children, disabled, value, ...rest} = props
  const tabs = useTabs()
  const selected = tabs.selectedValue === value
  const id = `${tabs.baseId}-tab-${value}`
  const panelId = `${tabs.baseId}-panel-${value}`

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

  return (
    <button
      {...rest}
      ref={forwardRef}
      aria-controls={panelId}
      aria-disabled={disabled}
      aria-selected={selected}
      onKeyDown={composeEventHandlers(rest.onKeyDown, onKeyDown)}
      onMouseDown={composeEventHandlers(rest.onMouseDown, onMouseDown)}
      onFocus={composeEventHandlers(rest.onFocus, onFocus)}
      id={id}
      role="tab"
      tabIndex={selected ? 0 : -1}
      type="button"
    >
      {children}
    </button>
  )
})

type TabPanelProps = React.ComponentPropsWithoutRef<'div'> & {
  /**
   * Provide a value that uniquely identities the tab panel. This should mirror
   * the value set for the corresponding tab
   */
  value: string
}

function TabPanel({children, value, ...rest}: TabPanelProps) {
  const tabs = useTabs()
  const id = `${tabs.baseId}-panel-${value}`
  const tabId = `${tabs.baseId}-tab-${value}`
  const selected = tabs.selectedValue === value

  return (
    <div {...rest} aria-labelledby={tabId} id={id} hidden={!selected} role="tabpanel">
      {children}
    </div>
  )
}

type TabsContextValue = {
  baseId: string
  selectedValue: string
  selectTab(value: string): void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs(): TabsContextValue {
  const context = React.useContext(TabsContext)
  if (context) {
    return context
  }
  throw new Error('Component must be used within a <Tabs> component')
}

export {Tabs, TabList, Tab, TabPanel}
export type {TabsProps, TabListProps, TabProps, TabPanelProps}
