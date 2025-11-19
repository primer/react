import React, {
  createContext,
  useContext,
  useId,
  useMemo,
  type AriaAttributes,
  type ElementRef,
  type PropsWithChildren,
} from 'react'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import {useControllableState} from '../../hooks/useControllableState'
import {useProvidedRefOrCreate} from '../../hooks'

/**
 * Props to be used when the Tabs component's state is controlled by the parent
 */
type ControlledTabsProps = {
  /**
   * Specify the selected tab
   */
  value: string

  /**
   * `defaultValue` can only be used in the uncontrolled variant of the component
   * If you need to use `defaultValue`, please switch to the uncontrolled variant by removing the `value` prop.
   */
  defaultValue?: never

  /**
   * Provide an optional callback that is called when the selected tab changes
   */
  onValueChange: ({value}: {value: string}) => void
}

/**
 * Props to be used when the Tabs component is managing its own state
 */
type UncontrolledTabsProps = {
  /**
   * Specify the default selected tab
   */
  defaultValue: string

  /**
   * `value` can only be used in the controlled variant of the component
   * If you need to use `value`, please switch to the controlled variant by removing the `defaultValue` prop.
   */
  value?: never

  /**
   * Provide an optional callback that is called when the selected tab changes
   */
  onValueChange?: ({value}: {value: string}) => void
}

type TabsProps = PropsWithChildren<ControlledTabsProps | UncontrolledTabsProps>

/**
 * The Tabs component provides the base structure for a tabbed interface, without providing any formal requirement on DOM structure or styling.
 * It manages the state of the selected tab, handles tab ordering/selection and provides context to its child components to ensure an accessible experience.
 *
 * This is intended to be used in conjunction with the `useTab`, `useTabList`, and `useTabPanel` hooks to build a fully accessible tabs component.
 * The `Tab`, `TabList`, and `TabPanel` components are provided for convenience to showcase the API & implementation.
 */
function Tabs(props: TabsProps) {
  const {children, onValueChange} = props
  const groupId = useId()

  const [selectedValue, setSelectedValue] = useControllableState<string>({
    name: 'tab-selection',
    defaultValue: props.defaultValue ?? props.value,
    value: props.value,
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

function useTabList<T extends HTMLElement>(
  props: TabListProps & {
    /** Optional ref to use for the tablist. If none is provided, one will be generated automatically */
    ref?: React.RefObject<T | null>
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

function TabList({children, ...rest}: TabListProps) {
  const {tabListProps} = useTabList<HTMLDivElement>(rest)

  return (
    <div {...rest} {...tabListProps}>
      {children}
    </div>
  )
}

function getFocusableTabs(tablist: HTMLElement): Array<HTMLElement> {
  return Array.from(tablist.querySelectorAll('[role="tab"]:not([aria-disabled])'))
}

type TabProps = React.ComponentPropsWithoutRef<'button'> & {
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
function useTab<T extends HTMLElement>(
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

type TabPanelProps = {
  /**
   * Provide a value that uniquely identifies the tab panel. This should mirror
   * the value set for the corresponding tab
   */
  value: string
}

/** Utility hook for tab panels */
function useTabPanel<T extends HTMLElement>(
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

function TabPanel({children, value, ...rest}: React.HTMLAttributes<HTMLDivElement> & TabPanelProps) {
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

export {Tabs, TabList, Tab, TabPanel, useTab, useTabList, useTabPanel}
export type {TabsProps, TabListProps, TabProps, TabPanelProps}
