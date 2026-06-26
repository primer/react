import React, {useId, useMemo, type ElementRef} from 'react'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import {useControllableState} from '../../hooks/useControllableState'
import {TabsContext} from './TabsContext'
import type {TabListProps, TabPanelProps, TabProps, TabsContextValue, TabsProps} from './types'
import {useTab} from './useTab'
import {useTabList} from './useTabList'
import {useTabPanel} from './useTabPanel'

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

function TabList({children, ...rest}: TabListProps) {
  const {tabListProps} = useTabList<HTMLDivElement>(rest)

  return (
    // @ts-expect-error it needs a non nullable ref
    <div {...rest} {...tabListProps}>
      {children}
    </div>
  )
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

function TabPanel({children, value, ...rest}: React.HTMLAttributes<HTMLDivElement> & TabPanelProps) {
  const {tabPanelProps} = useTabPanel({value})

  return (
    <div {...rest} {...tabPanelProps}>
      {children}
    </div>
  )
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