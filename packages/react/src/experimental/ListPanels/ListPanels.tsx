import React, {createContext, useEffect, useMemo, useState} from 'react'
import {TabContainer} from '../../internal/components/TabContainer'
import {useSlots} from '../../hooks/useSlots'
import type {PanelProps} from '../UnderlinePanels/UnderlinePanels'
import {ActionList, type ActionListItemProps, type ActionListProps} from '../../ActionList'
import {clsx} from 'clsx'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import styles from './ListPanels.module.css'

interface ListPanelsContextType {
  selectedTabId: string | null
  selectTab: (id: string) => void
}

const ListPanelsContext = createContext<ListPanelsContextType | undefined>(undefined)

export type ListPanelsProps = React.PropsWithChildren<{}>

export function ListPanels(props: ListPanelsProps) {
  const {children} = props

  const [{tabs}, panels] = useSlots(children, {
    tabs: Tabs,
  })

  const [selectedTabId, selectTab] = useState<string | null>(null)

  const contextValue = useMemo(() => {
    return {
      selectedTabId,
      selectTab,
    }
  }, [selectedTabId, selectTab])

  return (
    <ListPanelsContext.Provider value={contextValue}>
      <TabContainer
        className={styles.tabContainer}
        onTabChanged={e => {
          if (e.tab && e.tab.id !== selectedTabId) {
            selectTab(e.tab.id)
          }
        }}
      >
        {tabs}
        {panels}
      </TabContainer>
    </ListPanelsContext.Provider>
  )
}

export function Tabs(props: ActionListProps) {
  return (
    <div slot="tablist-wrapper" className={styles.tabs}>
      <ActionList role="tablist" aria-orientation="vertical" {...props} />
    </div>
  )
}

Tab.displayName = 'ListPanels.Tabs'
Tab.__SLOT__ = Symbol('ListPanels.Tabs')

export function Tab({
  'aria-selected': ariaSelected,
  ...rest
}: ActionListItemProps & Required<Pick<ActionListItemProps, 'id'>>) {
  const context = React.useContext(ListPanelsContext)
  const ref = React.useRef<HTMLLIElement>(null)

  if (!context) {
    throw new Error('Tab must be used within a ListPanels component')
  }

  useEffect(() => {
    if (ariaSelected && context.selectedTabId !== rest.id) {
      context.selectTab(rest.id)
    }
  }, [ariaSelected, context, rest.id])

  const isSelected = context.selectedTabId === rest.id

  useIsomorphicLayoutEffect(() => {
    if (ref.current && ref.current.getAttribute('aria-selected') === 'true' && !isSelected) {
      context.selectTab(rest.id)
    }
  }, [])

  return <ActionList.Item ref={ref} role="tab" aria-selected={isSelected} active={isSelected} {...rest} />
}

Tab.displayName = 'ListPanels.Tab'
Tab.__SLOT__ = Symbol('ListPanels.Tab')

export function Panel({className, ...rest}: PanelProps & Required<Pick<PanelProps, 'aria-labelledby'>>) {
  const context = React.useContext(ListPanelsContext)
  if (!context) {
    throw new Error('Panel must be used within a ListPanels component')
  }

  return (
    <div
      role="tabpanel"
      data-tab-container-no-tabstop
      // hidden={context.selectedTabId !== rest['aria-labelledby']}
      className={clsx(styles.tabpanel, className)}
      {...rest}
    />
  )
}

Panel.displayName = 'ActionListPanels.Panel'
Panel.__SLOT__ = Symbol('ListPanels.Panel')

ListPanels.Tab = Tab
ListPanels.Panel = Panel
ListPanels.Tabs = Tabs
