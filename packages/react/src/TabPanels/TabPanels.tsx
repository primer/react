import React from 'react'
import styled from 'styled-components'
import {TabContainerElement} from '@github/tab-container-element'
import {createComponent} from '@lit-labs/react'
import sx, {SxProp} from '../sx'

const TabContainer = styled(createComponent(React, 'tab-container', TabContainerElement))(sx)

export type TabPanelsProps = {
  children: React.ReactNode
} & SxProp

function TabPanels({children}: TabPanelsProps) {
  const childrenArray = React.Children.toArray(children)
  let selectedTabIndex = -1
  let tabIndex = -1

  childrenArray.some(child => {
    if (React.isValidElement<Tab>(child) && child.type === Tab) {
      tabIndex += 1
      if (child.selected) {
        selectedTabIndex = tabIndex
        return true
      }
    }
  })
  selectedTabIndex = Math.max(selectedTabIndex, 0)
  tabIndex = -1
  let panelIndex = -1

  const tabs: Tab = []
  const panels: Panel = []
  for (const child of childrenArray) {
    if (React.isValidElement<Tab>(child) && child.type === Tab) {
      tabIndex += 1
      tabs.push(React.cloneElement(child, {selected: tabIndex === selectedTabIndex}))
    }
    if (React.isValidElement<Panel>(child) && child.type === Panel) {
      panelIndex += 1
      panels.push(React.cloneElement(child, {selected: panelIndex === selectedTabIndex}))
    }
  }

  if (tabIndex !== panelIndex) {
    throw new Error('TabPanels must have equal Panels and Tabs')
  }

  return (
    <TabContainer>
      <div role="tablist">{tabs}</div>
      {panels}
    </TabContainer>
  )
}

export type TabPanelsTabProps = {
  children: React.ReactNode
  selected: bool
} & SxProp

function Tab({children, selected}: TabPanelsTabProps) {
  return (
    <button role="tab" aria-selected={String(selected)}>
      {children}
    </button>
  )
}

Tab.displayName = 'TabPanels.Tab'

export type TabPanelsPanelProps = {
  children: React.ReactNode
  selected: bool
} & SxProp

function Panel({children, selected}: TabPanelsPanelProps) {
  return (
    <div role="tabpanel" hidden={!selected}>
      {children}
    </div>
  )
}

Panel.displayName = 'TabPanels.Panel'

export default Object.assign(TabPanels, {Panel, Tab})
