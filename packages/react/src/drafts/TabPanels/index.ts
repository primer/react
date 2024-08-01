import {TabPanels as TabPanelsImpl, Panel, Tab} from './TabPanels'
import type {TabPanelsProps, TabPanelsTabProps, TabPanelsPanelProps} from './TabPanels'

export const TabPanels = Object.assign(TabPanelsImpl, {Panel, Tab})

export type {TabPanelsProps, TabPanelsTabProps, TabPanelsPanelProps}
