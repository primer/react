import {createContext, useContext, useMemo, useRef, useState} from 'react'
import type {Icon} from '@primer/octicons-react'
import type {TabListProps, TabsProps} from '../Tabs'
import {clsx} from 'clsx'
import styles from './UnderlinePanels2.module.css'
import {Tabs, useTab, useTabList, useTabPanel} from '../Tabs'
import {UnderlineItem, UnderlineItemList, UnderlineWrapper} from '../../internal/components/UnderlineTabbedInterface'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import {useResizeObserver, type ResizeObserverEntry} from '../../hooks/useResizeObserver'

export type UnderlinePanelsProps = TabsProps & {
  /**
   * Custom prefix to use when generating the IDs of tabs and `aria-labelledby` for the panels
   */
  id?: string

  /**
   * Whether to show loading state for counters in tabs. Used when counter values are being fetched to prevent layout shifts.
   * @default false
   */
  loadingCounters?: boolean

  /**
   * A single TabList (UnderlinePanels.TabList) and panels (UnderlinePanels.Panel) to render
   */
  children: React.ReactNode
}

export function UnderlinePanels({children, loadingCounters, ...rest}: UnderlinePanelsProps) {
  const [iconsVisible, setIconsVisible] = useState(true)
  const contextValue = useMemo<UnderlinePanelsContextType>(
    () => ({loadingCounters: loadingCounters ?? false, iconsVisible, setIconsVisible}),
    [loadingCounters, iconsVisible],
  )

  return (
    <UnderlinePanelsContext.Provider value={contextValue}>
      <Tabs {...rest}>{children}</Tabs>
    </UnderlinePanelsContext.Provider>
  )
}

interface UnderlinePanelsContextType {
  loadingCounters: boolean
  iconsVisible: boolean
  setIconsVisible: (visible: boolean) => void
}

const UnderlinePanelsContext = createContext<UnderlinePanelsContextType | undefined>(undefined)

export type UnderlinePanelsTabListProps = TabListProps & {
  /**
   * A list of UnderlinePanels.Tab components
   */
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

function UnderlinePanelsTabList({className, children, ...props}: UnderlinePanelsTabListProps) {
  const listRef = useRef<HTMLUListElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const {tabListProps} = useTabList<HTMLUListElement>({
    ref: listRef,
    ...props,
  })
  const panelsContext = useContext(UnderlinePanelsContext)
  const [listWidth, setListWidth] = useState(0)

  useIsomorphicLayoutEffect(() => {
    setListWidth(listRef.current?.getBoundingClientRect().width ?? 0)
  }, [])

  useResizeObserver(
    (resizeObserverEntries: ResizeObserverEntry[]) => {
      const wrapperWidth = resizeObserverEntries[0].contentRect.width
      panelsContext?.setIconsVisible(wrapperWidth > listWidth)
    },
    wrapperRef,
    [],
  )

  return (
    <UnderlineWrapper
      ref={wrapperRef}
      data-icons-visible={panelsContext?.iconsVisible}
      className={clsx(className, styles.StyledUnderlineWrapper)}
    >
      <UnderlineItemList {...tabListProps} ref={listRef}>
        {children}
      </UnderlineItemList>
    </UnderlineWrapper>
  )
}

UnderlinePanels.TabList = UnderlinePanelsTabList
UnderlinePanelsTabList.displayName = 'UnderlinePanels.TabList'
UnderlinePanelsTabList.__SLOT__ = Symbol('UnderlinePanels.TabList')

export type UnderlinePanelsTabProps = {
  /**
   * Specify whether the tab is disabled
   * @default false
   */
  disabled?: boolean

  /**
   * Provide a value that uniquely identifies the tab.
   * This should mirror the value provided to the corresponding TabPanel
   */
  value: string

  /**
   * Content of CounterLabel rendered after tab text label
   */
  counter?: number | string

  /**
   *  Icon rendered before the tab text label
   */
  icon?: Icon

  /**
   * Content of the tab
   */
  children: React.ReactNode
}

function UnderlinePanelsTab({children, ...props}: UnderlinePanelsTabProps) {
  const {tabProps} = useTab(props)

  const panelsContext = useContext(UnderlinePanelsContext)
  const loadingCounters = panelsContext?.loadingCounters ?? false

  return (
    <UnderlineItem
      as="button"
      {...tabProps}
      counter={props.counter}
      loadingCounters={loadingCounters}
      icon={props.icon}
      iconsVisible={panelsContext?.iconsVisible}
    >
      {children}
    </UnderlineItem>
  )
}

UnderlinePanels.Tab = UnderlinePanelsTab
UnderlinePanelsTab.displayName = 'UnderlinePanels.Tab'
UnderlinePanelsTab.__SLOT__ = Symbol('UnderlinePanels.Tab')

export type UnderlinePanelsPanelProps = {
  /**
   * Provide a value that uniquely identifies the tab panel. This should mirror
   * the value set for the corresponding tab
   */
  value: string

  /**
   * Content of the panel
   */
  children: React.ReactNode
}

function UnderlinePanelsPanel({value, ...rest}: UnderlinePanelsPanelProps) {
  const {tabPanelProps} = useTabPanel({value})

  return <div {...tabPanelProps} {...rest} />
}

UnderlinePanels.Panel = UnderlinePanelsPanel
UnderlinePanelsPanel.displayName = 'UnderlinePanels.Panel'
UnderlinePanelsPanel.__SLOT__ = Symbol('UnderlinePanels.Panel')
