import {UnderlinePanels as UnderlinePanelsImpl, Panel, Tab} from './UnderlinePanels'
import type {
  UnderlinePanelsProps,
  TabProps as UnderlinePanelsTabProps,
  PanelProps as UnderlinePanelsPanelProps,
} from './UnderlinePanels'

Tab.displayName = 'UnderlinePanels.Tab'
Panel.displayName = 'UnderlinePanels.Panel'

export const UnderlinePanels = Object.assign(UnderlinePanelsImpl, {Panel, Tab})

export type {UnderlinePanelsProps, UnderlinePanelsTabProps, UnderlinePanelsPanelProps}
