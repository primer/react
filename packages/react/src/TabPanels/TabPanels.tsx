import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import clsx from 'clsx'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import {TabContainerElement} from '@github/tab-container-element'
import {createComponent} from '@lit-labs/react'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'
import getGlobalFocusStyles from '../internal/utils/getGlobalFocusStyles'

const TAB_CLASS = 'TabPanel-tab'

const TabContainer = styled(createComponent(React, 'tab-container', TabContainerElement))(sx)

const TabList = styled.div`
  display: flex;
  margin-bottom: -1px;
  overflow: auto;
`

const TabListWrapper = styled.div`
  margin-top: 0;
  border-bottom: 1px solid ${get('colors.border.default')};
`

export type TabPanelsProps = ComponentProps<typeof TabContainer>

function TabPanels({children, 'aria-label': ariaLabel}: TabPanelsProps) {
  const childrenArray = React.Children.toArray(children)
  let selectedTabIndex = -1
  let tabIndex = -1

  for (const child of childrenArray) {
    if (React.isValidElement<TabPanelsTabProps>(child) && child.type === Tab) {
      tabIndex += 1
      if (child.props.selected === true) {
        selectedTabIndex = tabIndex
        break
      }
    }
  }

  if (tabIndex === -1) {
    throw new Error('TabPanels must have at least one Tab')
  }

  selectedTabIndex = Math.max(selectedTabIndex, 0)
  tabIndex = -1
  let panelIndex = -1

  const tabs: JSX.Element[] = []
  const panels: JSX.Element[] = []
  for (const child of childrenArray) {
    if (React.isValidElement<TabPanelsTabProps>(child) && child.type === Tab) {
      tabIndex += 1
      tabs.push(React.cloneElement(child, {selected: tabIndex === selectedTabIndex}))
    }
    if (React.isValidElement<TabPanelsPanelProps>(child) && child.type === Panel) {
      panelIndex += 1
      panels.push(React.cloneElement(child, {selected: panelIndex === selectedTabIndex}))
    }
  }

  if (tabIndex !== panelIndex) {
    throw new Error('TabPanels must have equal Panels and Tabs')
  }

  return (
    <TabContainer>
      <TabListWrapper>
        <TabList aria-label={ariaLabel} role="tablist">
          {tabs}
        </TabList>
      </TabListWrapper>
      {panels}
    </TabContainer>
  )
}

export type TabPanelsTabProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  children: React.ReactNode
  selected?: boolean
} & SxProp

const Tab = styled.button.attrs<TabPanelsTabProps>(props => ({
  className: clsx(TAB_CLASS, props.className),
  role: 'tab',
  'aria-selected': !!props.selected,
}))<TabPanelsTabProps>`
  padding: 8px 16px;
  font-size: ${get('fontSizes.1')};
  line-height: 23px;
  color: ${get('colors.fg.muted')};
  text-decoration: none;
  background-color: transparent;
  border: 1px solid transparent;
  border-bottom: 0;
  cursor: pointer;

  ${getGlobalFocusStyles('-6px')};

  &:hover,
  &:focus {
    color: ${get('colors.fg.default')};
    text-decoration: none;
  }

  &:hover {
    transition-duration: 0.1s;
    transition-property: color;
  }

  &[aria-selected='true'] {
    color: ${get('colors.fg.default')};
    border-color: ${get('colors.border.default')};
    border-top-right-radius: ${get('radii.2')};
    border-top-left-radius: ${get('radii.2')};
    background-color: ${get('colors.canvas.default')};
  }

  ${sx};
` as PolymorphicForwardRefComponent<'button', TabPanelsTabProps>

Tab.displayName = 'TabPanels.Tab'

export type TabPanelsPanelProps = {
  children: React.ReactNode
  selected?: boolean
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
