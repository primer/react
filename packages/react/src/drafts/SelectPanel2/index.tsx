import {
  Panel,
  SelectPanelButton,
  SelectPanelHeader,
  SelectPanelSearchInput,
  SelectPanelFooter,
  SelectPanelLoading,
  SelectPanelMessage,
  SelectPanelSecondaryAction,
} from './SelectPanel'
import type {SelectPanelProps, SelectPanelSecondaryActionProps, SelectPanelMessageProps} from './SelectPanel'

export const SelectPanel = Object.assign(Panel, {
  Button: SelectPanelButton,
  Header: SelectPanelHeader,
  SearchInput: SelectPanelSearchInput,
  Footer: SelectPanelFooter,
  Loading: SelectPanelLoading,
  Message: SelectPanelMessage,
  SecondaryAction: SelectPanelSecondaryAction,
})

export type {SelectPanelProps, SelectPanelSecondaryActionProps, SelectPanelMessageProps}
