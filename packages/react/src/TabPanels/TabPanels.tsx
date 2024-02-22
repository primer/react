import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import clsx from 'clsx'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import {TabContainerElement} from '@github/tab-container-element'
import {createComponent} from '@lit-labs/react'
import sx, {type SxProp} from '../sx'
import type {ComponentProps} from '../utils/types'
import getGlobalFocusStyles from '../internal/utils/getGlobalFocusStyles'

const TAB_CLASS = 'TabPanel-tab'

const TabContainer = styled(createComponent(React, 'tab-container', TabContainerElement))`
  &::part(tablist-wrapper) {
    margin-top: 0;
    margin-bottom: 16px;
    border-bottom: 1px solid ${get('colors.border.default')};
  }

  ${sx};
`

export type TabPanelsProps = ComponentProps<typeof TabContainer>

function TabPanels({children, 'aria-label': ariaLabel, onTabContainerChange, onTabContainerChanged}: TabPanelsProps) {
  // Find all of the tabs, create a map of their IDs to their selected state
  const tabMap = new Map<string, boolean>()
  React.Children.forEach(children, child => {
    if (React.isValidElement(child) && child.type === Tab) {
      tabMap.set(child.props.id, !!child.props.selected)
    }
  })
  
  // Update children to set hidden on the panels which do not correspond to the selected tab
  const updatedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type === Panel) {
      return React.cloneElement(child, {hidden: !child.props['aria-labelledby'] || !tabMap.get(child.props['aria-labelledby'])})
    }
    return child
  })
  
  return (
    <TabContainer
      aria-label={ariaLabel}
      onTabContainerChange={onTabContainerChange}
      onTabContainerChanged={onTabContainerChanged}
    >
      {updatedChildren}
    </TabContainer>
  )
}

export type TabPanelsTabProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  id: string
  selected?: boolean
} & SxProp

const Tab = styled.button.attrs<TabPanelsTabProps>(props => ({
  id: props.id,
  className: clsx(TAB_CLASS, props.className),
  role: 'tab',
  'aria-selected': !!props.selected,
}))<TabPanelsTabProps>`
  padding: 8px 16px 9px 16px;
  font-size: ${get('fontSizes.1')};
  line-height: 23px;
  color: ${get('colors.fg.muted')};
  text-decoration: none;
  background-color: transparent;
  border: 1px solid transparent;
  border-bottom: 0;
  margin-bottom: -1px;
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
  'aria-labelledby': string
  hidden?: boolean
  children: React.ReactNode
} & SxProp

const Panel = styled.div.attrs<TabPanelsPanelProps>(props => ({
  'aria-labelledby': props['aria-labelledby'],
  hidden: !!props.hidden,
  role: 'tabpanel',
}))<TabPanelsPanelProps>`
  ${sx};
`

Panel.displayName = 'TabPanels.Panel'

export default Object.assign(TabPanels, {Panel, Tab})
