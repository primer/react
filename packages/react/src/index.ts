'use client'

export {default as theme, type ThemeColorPaths, type ThemeShadowPaths} from './theme'
export {AriaStatus, AriaAlert} from './live-region'
export type {AriaStatusProps, AriaAlertProps} from './live-region'
export {default as BaseStyles} from './BaseStyles'
export type {BaseStylesProps} from './BaseStyles'
export {default as ThemeProvider} from './ThemeProvider'
export {useTheme, useColorSchemeVar} from './useTheme'
export type {ThemeProviderProps} from './ThemeProvider'

// Layout
export * from './Button'
export * as PageLayout from './PageLayout/PageLayout.namespace'
export type {
  PageLayoutProps,
  PageLayoutHeaderProps,
  PageLayoutContentProps,
  PageLayoutPaneProps,
  PageLayoutFooterProps,
} from './PageLayout'
export {usePaneWidth, defaultPaneWidth, DragHandle} from './PageLayout'
export type {
  DragHandleProps,
  UsePaneWidthOptions,
  UsePaneWidthResult,
  PaneWidth,
  PaneWidthValue,
  CustomWidthOptions,
} from './PageLayout'
export * as SplitPageLayout from './SplitPageLayout/SplitPageLayout.namespace'
export type {
  SplitPageLayoutProps,
  SplitPageLayoutHeaderProps,
  SplitPageLayoutContentProps,
  SplitPageLayoutPaneProps,
  SplitPageLayoutFooterProps,
} from './SplitPageLayout'

// Hooks
export {default as useDetails} from './hooks/useDetails'
export {default as useSafeTimeout} from './hooks/useSafeTimeout'
export {useOnOutsideClick} from './hooks/useOnOutsideClick'
export type {TouchOrMouseEvent} from './hooks/useOnOutsideClick'
export {useOpenAndCloseFocus} from './hooks/useOpenAndCloseFocus'
export {useOnEscapePress} from './hooks/useOnEscapePress'
export {useOverlay} from './hooks/useOverlay'
export {useConfirm} from './ConfirmationDialog/useConfirm'
export {useFocusTrap} from './hooks/useFocusTrap'
export type {FocusTrapHookSettings} from './hooks/useFocusTrap'
export {FocusKeys, useFocusZone} from './hooks/useFocusZone'
export type {FocusZoneHookSettings} from './hooks/useFocusZone'
export {useRefObjectAsForwardedRef} from './hooks/useRefObjectAsForwardedRef'
export {useMergedRefs} from './hooks/useMergedRefs'
export {useResizeObserver} from './hooks/useResizeObserver'
export {useResponsiveValue, type ResponsiveValue} from './hooks/useResponsiveValue'
export {default as useIsomorphicLayoutEffect} from './utils/useIsomorphicLayoutEffect'
export {useProvidedRefOrCreate} from './hooks/useProvidedRefOrCreate'
export {useId} from './hooks/useId'
export {useSyncedState} from './hooks/useSyncedState'
export {useAnchoredPosition, type AnchoredPositionHookSettings} from './hooks/useAnchoredPosition'

// Utils
export {createComponent} from './utils/create-component'
export type {SlotMarker, WithSlotMarker, FCWithSlotMarker} from './utils/types'
export {asSlot} from './utils/as-slot'
export {isSlot} from './utils/is-slot'
export {useSlots} from './hooks/useSlots'

// Components
export {default as Radio} from './Radio'
export type {RadioProps} from './Radio'
export * as ActionList from './ActionList/ActionList.namespace'
export type {
  ActionListProps,
  ActionListGroupProps,
  ActionListGroupHeadingProps,
  ActionListGroupHeadingTrailingActionProps,
  ActionListItemProps,
  ActionListLinkItemProps,
  ActionListDividerProps,
  ActionListDescriptionProps,
  ActionListLeadingVisualProps,
  ActionListTrailingActionProps,
  ActionListTrailingVisualProps,
} from './ActionList'
export * as ActionMenu from './ActionMenu/ActionMenu.namespace'
export type {ActionMenuProps, ActionMenuAnchorProps, ActionMenuButtonProps} from './ActionMenu'
export {AnchoredOverlay} from './AnchoredOverlay'
export type {AnchoredOverlayProps} from './AnchoredOverlay'
export * as Autocomplete from './Autocomplete/Autocomplete.namespace'
export type {AutocompleteMenuProps, AutocompleteInputProps, AutocompleteOverlayProps} from './Autocomplete'
export {default as Avatar} from './Avatar'
export type {AvatarProps} from './Avatar'
export {default as AvatarStack} from './AvatarStack'
export type {AvatarStackProps} from './AvatarStack'
export * as Banner from './Banner/Banner.namespace'
export type {BannerProps} from './Banner'

export {default as BranchName} from './BranchName'
export type {BranchNameProps} from './BranchName'
export * as Breadcrumbs from './Breadcrumbs/Breadcrumbs.namespace'
export * as Breadcrumb from './Breadcrumbs/Breadcrumbs.namespace'
export type {BreadcrumbsProps, BreadcrumbsItemProps, BreadcrumbProps, BreadcrumbItemProps} from './Breadcrumbs'
export {default as ButtonGroup} from './ButtonGroup'
export type {ButtonGroupProps} from './ButtonGroup'
export type {CircleBadgeProps, CircleBadgeIconProps} from './CircleBadge'
export * as CheckboxGroup from './CheckboxGroup/CheckboxGroup.namespace'
export type {CheckboxGroupProps} from './CheckboxGroup'
export * as CircleBadge from './CircleBadge/CircleBadge.namespace'
export {default as CounterLabel} from './CounterLabel'
export type {CounterLabelProps} from './CounterLabel'
export * as Details from './Details/Details.namespace'
export type {DetailsProps} from './Details'
export * as Dialog from './Dialog/Dialog.namespace'
export type {DialogProps, DialogHeaderProps, DialogButtonProps, DialogWidth, DialogHeight} from './Dialog'
export type {ConfirmationDialogProps} from './ConfirmationDialog/ConfirmationDialog'
export {ConfirmationDialog} from './ConfirmationDialog/ConfirmationDialog'
export {default as Flash} from './Flash'
export type {FlashProps} from './Flash'
export * as FormControl from './FormControl/FormControl.namespace'
export type {
  FormControlProps,
  FormControlCaptionProps,
  FormControlLabelProps,
  FormControlValidationProps,
} from './FormControl'
export {useFormControlForwardedProps} from './FormControl'
export * as Header from './Header/Header.namespace'
export type {HeaderProps, HeaderItemProps, HeaderLinkProps} from './Header'
export {default as Heading} from './Heading'
export type {HeadingProps} from './Heading'
export {default as Label} from './Label'
export type {LabelProps, LabelColorOptions} from './Label'
export {default as LabelGroup} from './LabelGroup'
export type {LabelGroupProps} from './LabelGroup'
export {default as Link} from './Link'
export type {LinkProps} from './Link'
export * as NavList from './NavList/NavList.namespace'
export type {
  NavListProps,
  NavListItemProps,
  NavListSubNavProps,
  NavListGroupProps,
  NavListLeadingVisualProps,
  NavListTrailingVisualProps,
  NavListDividerProps,
  NavListGroupHeadingProps,
} from './NavList'
export {default as Overlay} from './Overlay'
export type {OverlayProps} from './Overlay'
export {default as Pagination} from './Pagination'
export type {PaginationProps} from './Pagination'
export * as Popover from './Popover/Popover.namespace'
export type {PopoverProps, PopoverContentProps} from './Popover'
export {default as Portal, registerPortalRoot, PortalContext} from './Portal'
export type {PortalProps} from './Portal'
export * as ProgressBar from './ProgressBar/ProgressBar.namespace'
export type {ProgressBarProps, ProgressBarItemProps} from './ProgressBar'
export * as RadioGroup from './RadioGroup/RadioGroup.namespace'
export type {RadioGroupProps} from './RadioGroup'
export type {RelativeTimeProps} from './RelativeTime'
export {default as RelativeTime} from './RelativeTime'
export * as SegmentedControl from './SegmentedControl/SegmentedControl.namespace'
export type {
  SegmentedControlProps,
  SegmentedControlButtonProps,
  SegmentedControlIconButtonProps,
  SegmentedControlActionProps,
  SegmentedControlDividerProps,
} from './SegmentedControl'
// Currently there is a duplicate Select component at the root of the dir, so need to be explicit about exporting from the src/Select dir
export * as Select from './Select/Select.namespace'
export type {SelectProps} from './Select'
export * as SelectPanel from './SelectPanel/SelectPanel.namespace'
export type {
  SelectPanelProps,
  ItemProps as SelectPanelItemProps,
  GroupedListProps as SelectPanelGroupedListProps,
  ItemInput as SelectPanelItemInput,
} from './SelectPanel'
export * as SideNav from './SideNav.namespace'
export type {SideNavProps, SideNavLinkProps} from './SideNav'
export {default as Spinner} from './Spinner'
export type {SpinnerProps} from './Spinner'
export {default as StateLabel} from './StateLabel'
export type {StateLabelProps} from './StateLabel'
export * as SubNav from './SubNav/SubNav.namespace'
export type {SubNavProps, SubNavLinkProps, SubNavLinksProps} from './SubNav'
export {default as ToggleSwitch} from './ToggleSwitch'
export type {ToggleSwitchProps} from './ToggleSwitch'
export * as TextInput from './TextInput/TextInput.namespace'
export type {TextInputProps, TextInputActionProps} from './TextInput'
export {default as TextInputWithTokens} from './TextInputWithTokens'
export type {TextInputWithTokensProps} from './TextInputWithTokens'
export {default as Text} from './Text'
export type {TextProps} from './Text'
export * as Timeline from './Timeline/Timeline.namespace'
export type {
  TimelineProps,
  TimelineActionsProps,
  TimelineAvatarProps,
  TimelineBadgeVariant,
  TimelineBadgeProps,
  TimelineBodyProps,
  TimelineBreakProps,
  TimelineItemsProps,
  TimelineItemProps,
} from './Timeline'
export {default as Token, IssueLabelToken} from './Token'
export type {TokenProps, IssueLabelTokenProps} from './Token'
export {Tooltip} from './TooltipV2'
export type {TooltipProps} from './TooltipV2'
export {default as Truncate} from './Truncate'
export type {TruncateProps} from './Truncate'

export {default as Checkbox} from './Checkbox'
export type {CheckboxProps} from './Checkbox'

export {default as Textarea} from './Textarea'
export type {TextareaProps} from './Textarea'

export * as TreeView from './TreeView/TreeView.namespace'
export {useRovingTabIndex} from './TreeView/useRovingTabIndex'
export type {
  TreeViewProps,
  TreeViewItemProps,
  TreeViewSubTreeProps,
  TreeViewVisualProps,
  TreeViewErrorDialogProps,
} from './TreeView'

export {VisuallyHidden} from './VisuallyHidden'
export type {VisuallyHiddenProps} from './VisuallyHidden'

export * as UnderlineNav from './UnderlineNav/UnderlineNav.namespace'
export type {UnderlineNavProps, UnderlineNavItemProps} from './UnderlineNav'

export * as ActionBar from './ActionBar/ActionBar.namespace'
export type {ActionBarProps} from './ActionBar'

export * as Stack from './Stack/Stack.namespace'
export type {StackProps, StackItemProps} from './Stack'

export * as PageHeader from './PageHeader/PageHeader.namespace'
export type {
  PageHeaderProps,
  TitleProps as PageHeaderTitleProps,
  ActionsProps as PageHeaderActionsProps,
  TitleAreaProps as PageHeaderTitleAreaProps,
  ChildrenPropTypes as PageHeaderChildrenPropTypes,
} from './PageHeader'

export {SkeletonBox} from './Skeleton'
export type {SkeletonBoxProps} from './Skeleton'
