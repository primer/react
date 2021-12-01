import Button, {ButtonProps} from './Button'
import React from 'react'
import {AnchoredOverlay} from './AnchoredOverlay'
import {useProvidedStateOrCreate} from './hooks/useProvidedStateOrCreate'
import {OverlayProps} from './Overlay'
import {useProvidedRefOrCreate} from './hooks'
import {AnchoredOverlayWrapperAnchorProps} from './AnchoredOverlay/AnchoredOverlay'
import {Divider} from './ActionList2/Divider'
import {MenuContext as ActionListMenuContext} from './ActionList2/MenuContext'

type ActionMenuBaseProps = {
  /**
   * Recommended: `ActionMenu.Button` or `ActionMenu.Anchor` with ActionList`
   */
  children: React.ReactElement[] | React.ReactElement

  /**
   * If defined, will control the open/closed state of the overlay. Must be used in conjuction with `onOpenChange`.
   */
  open?: boolean

  /**
   * If defined, will control the open/closed state of the overlay. Must be used in conjuction with `open`.
   */
  onOpenChange?: (s: boolean) => void
}

export type ActionMenuProps = ActionMenuBaseProps & AnchoredOverlayWrapperAnchorProps

const ActionMenuBase: React.FC<ActionMenuProps> = ({
  anchorRef: externalAnchorRef,
  open,
  onOpenChange,
  children
}: ActionMenuProps) => {
  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate(open, onOpenChange, false)
  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const onOpen = React.useCallback(() => setCombinedOpenState(true), [setCombinedOpenState])
  const onClose = React.useCallback(() => setCombinedOpenState(false), [setCombinedOpenState])

  let renderAnchor: AnchoredOverlayWrapperAnchorProps['renderAnchor'] = null
  let contents: React.ReactElement[] = []
  let overlayProps = {}

  React.Children.map(children, child => {
    if (child.type === MenuButton || child.type === Anchor) {
      renderAnchor = anchorProps => React.cloneElement(child, anchorProps)
    } else if (child.type === Overlay) {
      const {children: overlayChildren, ...childProps} = child.props
      contents = overlayChildren
      overlayProps = childProps
    }
  })

  return (
    <AnchoredOverlay
      renderAnchor={renderAnchor}
      anchorRef={anchorRef}
      open={combinedOpenState}
      onOpen={onOpen}
      onClose={onClose}
      overlayProps={overlayProps}
    >
      <ActionListMenuContext.Provider
        value={{parent: 'ActionMenu', listRole: 'menu', itemRole: 'menuitem', afterSelect: onClose}}
      >
        {contents}
      </ActionListMenuContext.Provider>
    </AnchoredOverlay>
  )
}

type AnchorRef = AnchoredOverlayWrapperAnchorProps['anchorRef']

export type MenuAnchorProps = {children: React.ReactElement}
const Anchor = React.forwardRef<AnchorRef, MenuAnchorProps>(({children, ...anchorProps}, anchorRef) => {
  return React.cloneElement(children, {...anchorProps, ref: anchorRef})
})

/** this component is syntactical sugar 🍭 */
export type MenuButtonProps = ButtonProps
const MenuButton = React.forwardRef<AnchorRef, ButtonProps>((props, anchorRef) => {
  return (
    <Anchor ref={anchorRef}>
      <Button {...props} />
    </Anchor>
  )
})

/** this component is syntactical sugar 🍭 */
type MenuOverlayProps = Partial<OverlayProps> & {children: React.ReactElement[] | React.ReactElement}
const Overlay: React.FC<MenuOverlayProps> = props => <>{props.children}</>

ActionMenuBase.displayName = 'ActionMenu'
export const ActionMenu = Object.assign(ActionMenuBase, {Button: MenuButton, Anchor, Overlay, Divider})
