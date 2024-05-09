import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../../utils/polymorphic'
import clsx from 'clsx'
import React from 'react'
import styled from 'styled-components'
import {get} from '../../constants'
import {TabContainerElement} from '@github/tab-container-element'
import {createComponent} from '../../utils/create-component'
import sx, {type SxProp} from '../../sx'
import type {ComponentProps} from '../../utils/types'
import getGlobalFocusStyles from '../../internal/utils/getGlobalFocusStyles'

const TAB_CLASS = 'TabPanel-tab'

const tabContainerComponent = createComponent(TabContainerElement, 'tab-container')
const TabContainer = styled(tabContainerComponent)`
  & > :not([role='tabpanel']) {
    display: inline-block;
  }

  &::part(tablist-wrapper) {
    margin-top: 0;
    margin-bottom: 16px;
    border-bottom: 1px solid ${get('colors.border.default')};
  }

  &:not(:defined) [role='tabpanel'] {
    margin-top: 17px;
    display: none;
  }

  &:not(:defined) [role='tab']:nth-of-type(1)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(1),
  &:not(:defined) [role='tab']:nth-of-type(2)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(2),
  &:not(:defined) [role='tab']:nth-of-type(3)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(3),
  &:not(:defined) [role='tab']:nth-of-type(4)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(4),
  &:not(:defined) [role='tab']:nth-of-type(5)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(5),
  &:not(:defined) [role='tab']:nth-of-type(6)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(6),
  &:not(:defined) [role='tab']:nth-of-type(7)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(7),
  &:not(:defined) [role='tab']:nth-of-type(8)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(8),
  &:not(:defined) [role='tab']:nth-of-type(9)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(9),
  &:not(:defined) [role='tab']:nth-of-type(10)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(10) {
    display: block;
  }

  &:not(:defined):not(:has([aria-selected='true'])) [role='tabpanel']:first-of-type {
    display: block;
  }

  &:not(:has([aria-selected='true'])) [role='tab'] ~ [role='tab'] {
    color: ${get('colors.fg.muted')};
    background-color: transparent;
    border: 1px solid transparent;
  }

  &:not(:has([aria-selected='true'])) [role='tab'],
  & [role='tab'][aria-selected='true'] {
    color: ${get('colors.fg.default')};
    border-color: ${get('colors.border.default')};
    border-top-right-radius: ${get('radii.2')};
    border-top-left-radius: ${get('radii.2')};
    background-color: ${get('colors.canvas.default')};
  }

  &:not(:defined):not(:has([aria-selected='true'])) [role='tab'] ~ [role='tab'],
  &:not(:defined):has([aria-selected='true']) [role='tab']:not([aria-selected='true']) {
    padding: 8px 16px;
    border-bottom: 1px solid ${get('colors.border.default')};
  }

  &:not(:defined) :not([role='tabpanel']) {
    vertical-align: top;
  }

  ${sx};
`

type Label = {
  'aria-label': string
  'aria-labelledby'?: never
}

type Labelledby = {
  'aria-label'?: never
  'aria-labelledby': string
}

type Labelled = Label | Labelledby

export type TabPanelsProps = ComponentProps<typeof TabContainer> & {
  id?: string
} & Labelled

function TabPanels({children, defaultTabIndex, ...props}: TabPanelsProps) {
  // We need to always call React.useId() because
  // React Hooks must be called in the exact same order in every component render
  const defaultId = React.useId()
  const parentId = props.id ?? defaultId

  if (defaultTabIndex !== undefined) {
    // Add 'dafault-tab' to props
    props['default-tab'] = defaultTabIndex
  }

  // Loop through the chidren, if it's a tab, then add id="{id}-tab-{index}"
  // If it's a panel, then add aria-labelledby="{id}-tab-{index}"
  let tabIndex = 0
  let panelIndex = 0

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement<TabPanelsTabProps>(child) && child.type === Tab) {
      if (props.selectedTabIndex === tabIndex) {
        return React.cloneElement(child, {id: `${parentId}-tab-${tabIndex++}`, selected: true})
      }

      return React.cloneElement(child, {id: `${parentId}-tab-${tabIndex++}`})
    }
    if (React.isValidElement<TabPanelsPanelProps>(child) && child.type === Panel) {
      return React.cloneElement(child, {'aria-labelledby': `${parentId}-tab-${panelIndex++}`})
    }
    return child
  })

  return (
    <TabContainer {...props} id={parentId}>
      {childrenWithProps}
    </TabContainer>
  )
}

export type TabPanelsTabProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  selected?: boolean
} & SxProp

const Tab = styled.button.attrs<TabPanelsTabProps>(props => ({
  className: clsx(TAB_CLASS, props.className),
  role: 'tab',
  'aria-selected': !!props.selected,
  suppressHydrationWarning: true,
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

  ${sx};
` as PolymorphicForwardRefComponent<'button', TabPanelsTabProps>

Tab.displayName = 'TabPanels.Tab'

export type TabPanelsPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
} & SxProp

const Panel = styled.div.attrs<TabPanelsPanelProps>(() => ({
  role: 'tabpanel',
  suppressHydrationWarning: true,
}))<TabPanelsPanelProps>`
  ${sx};
`

Panel.displayName = 'TabPanels.Panel'

export default Object.assign(TabPanels, {Panel, Tab})
