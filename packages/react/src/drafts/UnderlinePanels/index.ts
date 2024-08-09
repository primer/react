import {UnderlinePanels as UnderlinePanelsImpl, Panel, Tab} from './UnderlinePanels'
import type {
  UnderlinePanelsProps,
  TabProps as UnderlinePanelsTabProps,
  PanelProps as UnderlinePanelsPanelProps,
} from './UnderlinePanels'

export const UnderlinePanels = Object.assign(UnderlinePanelsImpl, {Panel, Tab})

export type {UnderlinePanelsProps, UnderlinePanelsTabProps, UnderlinePanelsPanelProps}
