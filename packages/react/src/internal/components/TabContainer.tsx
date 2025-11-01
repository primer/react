import type {EventName} from '@lit-labs/react'
import {TabContainerElement, type TabContainerChangeEvent} from '@github/tab-container-element'
import {createComponent} from '../../utils/create-component'

export const TabContainer = createComponent(TabContainerElement, 'tab-container', {
  onTabChange: 'tab-container-change' as EventName<TabContainerChangeEvent>,
  onTabChanged: 'tab-container-changed' as EventName<TabContainerChangeEvent>,
})
