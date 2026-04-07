import {TriangleDownIcon, type IconProps} from '@primer/octicons-react'
import {announce} from '@primer/live-region-element'
import type React from 'react'

import type {AnchoredOverlayProps} from '../AnchoredOverlay'
import type {AnchoredOverlayWrapperAnchorProps} from '../AnchoredOverlay/AnchoredOverlay'
import {Button, LinkButton} from '../Button'
import type {ButtonProps, LinkButtonProps} from '../Button/types'
import type {FilteredActionListProps, ItemInput} from '../FilteredActionList'
import type {FocusZoneHookSettings} from '../hooks/useFocusZone'
import type {OverlayProps} from '../Overlay'
import {SelectPanelMessage} from './SelectPanelMessage'

export const SHORT_DELAY_MS = 500
export const LONG_DELAY_MS = 1000

const EMPTY_MESSAGE = {
  title: 'No items available',
  description: '',
}

export const DefaultEmptyMessage = (
  <SelectPanelMessage variant="empty" title={EMPTY_MESSAGE.title} key="empty-message">
    {EMPTY_MESSAGE.description}
  </SelectPanelMessage>
)

async function announceText(text: string, delayMs = SHORT_DELAY_MS) {
  const liveRegion = document.querySelector('live-region')

  liveRegion?.clear()

  await announce(text, {
    delayMs,
    from: liveRegion || undefined,
  })
}

export async function announceLoading() {
  await announceText('Loading.')
}

export interface SelectPanelSingleSelection {
  selected: ItemInput | undefined
  onSelectedChange: (selected: ItemInput | undefined) => void
}

export interface SelectPanelMultiSelection {
  selected: ItemInput[]
  onSelectedChange: (selected: ItemInput[]) => void
}

export type InitialLoadingType = 'spinner' | 'skeleton'

export function SecondaryActionButton(props: ButtonProps) {
  return <Button block {...props} />
}

export function SecondaryActionLink(props: LinkButtonProps & ButtonProps) {
  return <LinkButton {...props} variant="invisible" block />
}

export type SelectPanelSecondaryAction =
  | React.ReactElement<typeof SecondaryActionButton>
  | React.ReactElement<typeof SecondaryActionLink>

export interface SelectPanelBaseProps {
  // TODO: Make `title` required in the next major version
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title?: string | React.ReactElement<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subtitle?: string | React.ReactElement<any>
  onOpenChange: (
    open: boolean,
    gesture: 'anchor-click' | 'anchor-key-press' | 'click-outside' | 'escape' | 'selection' | 'cancel',
  ) => void
  secondaryAction?: SelectPanelSecondaryAction
  placeholder?: string
  // TODO: Make `inputLabel` required in next major version
  inputLabel?: string
  overlayProps?: Partial<OverlayProps>
  initialLoadingType?: InitialLoadingType
  className?: string
  notice?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    text: string | React.ReactElement<any>
    variant: 'info' | 'warning' | 'error'
  }
  message?: {
    title: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: string | React.ReactElement<any>
    variant: 'empty' | 'error' | 'warning'
    icon?: React.ComponentType<IconProps>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action?: React.ReactElement<any>
  }
  /**
   * @deprecated Use `secondaryAction` instead.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  footer?: string | React.ReactElement<any>
  showSelectedOptionsFirst?: boolean
  /**
   * Whether to disable fullscreen behavior on narrow viewports.
   * When `true`, the panel will maintain its anchored position regardless of viewport size.
   * When `false`, the panel will go fullscreen on narrow viewports (if feature flag is enabled).
   * @default undefined (uses feature flag default)
   */
  disableFullscreenOnNarrow?: boolean
  showSelectAll?: boolean
  /**
   * Set to true to allow focus to move to elements that are dynamically prepended to the container.
   * Default is false.
   */
  focusPrependedElements?: boolean
}

export type SelectPanelListProps = Omit<FilteredActionListProps, 'selectionVariant' | 'variant' | 'message'>

export type SelectPanelVariantProps =
  | {variant?: 'anchored'; onCancel?: () => void}
  | {variant: 'modal'; onCancel: () => void}

export type SelectPanelProps = SelectPanelBaseProps &
  SelectPanelListProps &
  Pick<AnchoredOverlayProps, 'open' | 'height' | 'width' | 'align' | 'displayInViewport'> &
  AnchoredOverlayWrapperAnchorProps &
  (SelectPanelSingleSelection | SelectPanelMultiSelection) &
  SelectPanelVariantProps

type SelectPanelPropsWithoutSelection = Omit<
  SelectPanelProps,
  keyof SelectPanelSingleSelection | keyof SelectPanelMultiSelection
>

export type SelectPanelNextMode = 'single' | 'multi'

export type SelectPanelNextSingleProps = SelectPanelPropsWithoutSelection &
  SelectPanelSingleSelection & {
    mode: 'single'
  }

export type SelectPanelNextMultiProps = SelectPanelPropsWithoutSelection &
  SelectPanelMultiSelection & {
    mode: 'multi'
  }

export type SelectPanelNextProps = SelectPanelNextSingleProps | SelectPanelNextMultiProps

export function isMultiSelectVariant(
  selected: SelectPanelSingleSelection['selected'] | SelectPanelMultiSelection['selected'],
): selected is SelectPanelMultiSelection['selected'] {
  return Array.isArray(selected)
}

export function toSelectedItemArray(
  selected: SelectPanelSingleSelection['selected'] | SelectPanelMultiSelection['selected'],
) {
  return Array.isArray(selected) ? selected : selected ? [selected] : []
}

export const focusZoneSettings: Partial<FocusZoneHookSettings> = {
  disabled: true,
}

export const closeButtonProps = {'aria-label': 'Cancel and close'}

export const areItemsEqual = (itemA: ItemInput, itemB: ItemInput) => {
  if (typeof itemA.id !== 'undefined') {
    return itemA.id === itemB.id
  }

  return itemA === itemB
}

export const doesItemsIncludeItem = (items: ItemInput[], item: ItemInput) => {
  return items.some(currentItem => areItemsEqual(currentItem, item))
}

export const defaultRenderAnchor: NonNullable<SelectPanelProps['renderAnchor']> = props => {
  const {children, ...rest} = props

  return (
    <Button trailingAction={TriangleDownIcon} {...rest}>
      {children}
    </Button>
  )
}

export const SELECT_PANEL_SLOT = Symbol('SelectPanel')
