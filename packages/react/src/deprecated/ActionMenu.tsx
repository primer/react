import type {GroupedListProps, ListPropsBase} from './ActionList/List'
import {List} from './ActionList/List'
import type {ItemProps} from './ActionList/Item'
import {Item} from './ActionList/Item'
import {Divider} from './ActionList/Divider'
import type {ButtonProps} from '../Button'
import {Button} from '../Button'
import type React from 'react'
import {useCallback, useMemo} from 'react'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'
import type {OverlayProps} from '../Overlay'
import {useProvidedRefOrCreate} from '../hooks'
import type {AnchoredOverlayWrapperAnchorProps} from '../AnchoredOverlay/AnchoredOverlay'

interface ActionMenuBaseProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  /**
   * Content that is passed into the renderAnchor component, which is a button by default.
   */
  anchorContent?: React.ReactNode

  /**
   * A callback that triggers both on clicks and keyboard events. This callback will be overridden by item level `onAction` callbacks.
   */
  onAction?: (props: ItemProps, event?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void

  /**
   * If defined, will control the open/closed state of the overlay. Must be used in conjuction with `setOpen`.
   */
  open?: boolean

  /**
   * If defined, will control the open/closed state of the overlay. Must be used in conjuction with `open`.
   */
  setOpen?: (s: boolean) => void

  /**
   * Props to be spread on the internal `Overlay` component.
   */
  overlayProps?: Partial<OverlayProps>
}

export type ActionMenuProps = ActionMenuBaseProps & AnchoredOverlayWrapperAnchorProps

const ActionMenuItem = (props: ItemProps) => <Item role="menuitem" {...props} />

ActionMenuItem.displayName = 'ActionMenu.Item'

const defaultRenderAnchor = <T extends ButtonProps>(props: T) => <Button {...props} />

const ActionMenuBase = ({
  anchorContent,
  renderAnchor = defaultRenderAnchor,
  anchorRef: externalAnchorRef,
  onAction,
  open,
  setOpen,
  overlayProps,
  items,
  ...listProps
}: ActionMenuProps): JSX.Element => {
  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate(open, setOpen, false)
  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const onOpen = useCallback(() => setCombinedOpenState(true), [setCombinedOpenState])
  const onClose = useCallback(() => setCombinedOpenState(false), [setCombinedOpenState])

  const renderMenuAnchor = useMemo(() => {
    if (renderAnchor === null) {
      return null
    }
    return <T extends React.HTMLAttributes<HTMLElement>>(props: T) => {
      return renderAnchor({
        'aria-label': 'menu',
        children: anchorContent,
        ...props,
      })
    }
  }, [anchorContent, renderAnchor])

  const itemsToRender = useMemo(() => {
    return items.map(item => {
      return {
        ...item,
        role: 'menuitem',
        onAction: (props, event) => {
          const actionCallback = item.onAction ?? onAction
          actionCallback?.(props as ItemProps, event)
          if (!event.defaultPrevented) {
            onClose()
          }
        },
      } as ItemProps
    })
  }, [items, onAction, onClose])

  return (
    <AnchoredOverlay
      renderAnchor={renderMenuAnchor}
      anchorRef={anchorRef}
      open={combinedOpenState}
      onOpen={onOpen}
      onClose={onClose}
      overlayProps={overlayProps}
    >
      <List {...listProps} role="menu" items={itemsToRender} />
    </AnchoredOverlay>
  )
}

ActionMenuBase.displayName = 'ActionMenu'

/**
 * @deprecated Use ActionMenu with composable API instead. See https://primer.style/react/ActionMenu for more details.
 */
export const ActionMenu = Object.assign(ActionMenuBase, {Divider, Item: ActionMenuItem})

ActionMenuBase.__SLOT__ = Symbol('DEPRECATED_ActionMenu')
ActionMenuItem.__SLOT__ = Symbol('DEPRECATED_ActionMenu.Item')
// @ts-ignore -- TS doesn't know about the __SLOT__ property
Divider.__SLOT__ = Symbol('DEPRECATED_ActionMenu.Divider')
