import {GroupedListProps, List, ListPropsBase} from './ActionList/List'
import {Item, ItemProps} from './ActionList/Item'
import {Divider} from './ActionList/Divider'
import Button, {ButtonProps} from './Button'
import React, {useCallback, useMemo} from 'react'
import {AnchoredOverlay} from './AnchoredOverlay'
import {useProvidedStateOrCreate} from './hooks/useProvidedStateOrCreate'
import {OverlayProps} from './Overlay'
import {useProvidedRefOrCreate} from './hooks'

interface ActionMenuPropsWithAnchor {
  /**
   * A custom function component used to render the anchor element.
   * Will receive the `anchoredContent` prop as `children` prop.
   * Uses a `Button` by default.
   */
  renderAnchor?: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element

  /**
   * An override to the internal renderAnchor ref that will be spread on to the renderAnchor,
   * When renderAnchor is defined, this prop will be spread on to the rendAnchor
   * component that is passed in.
   */
  anchorRef?: React.RefObject<HTMLElement>
}

interface ActionMenuPropsWithoutAnchor {
  /**
   * A custom function component used to render the anchor element.
   * When renderAnchor is null, an anchorRef is required.
   */
  renderAnchor: null

  /**
   * An override to the internal renderAnchor ref. When renderAnchor is null this can be
   * used to make an anchor that is detached from ActionMenu.
   */
  anchorRef: React.RefObject<HTMLElement>
}
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

export type ActionMenuProps = ActionMenuBaseProps & (ActionMenuPropsWithAnchor | ActionMenuPropsWithoutAnchor)

const ActionMenuItem = (props: ItemProps) => <Item role="menuitem" {...props} />

ActionMenuItem.displayName = 'ActionMenu.Item'

const ActionMenuBase = ({
  anchorContent,
  renderAnchor = <T extends ButtonProps>(props: T) => <Button {...props} />,
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
        ...props
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
        }
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

export const ActionMenu = Object.assign(ActionMenuBase, {Divider, Item: ActionMenuItem})
