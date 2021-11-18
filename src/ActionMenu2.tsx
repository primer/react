import Button, {ButtonProps} from './Button'
import React from 'react'
import {AnchoredOverlay} from './AnchoredOverlay'
import {useProvidedStateOrCreate} from './hooks/useProvidedStateOrCreate'
import {OverlayProps} from './Overlay'
import {useProvidedRefOrCreate} from './hooks'
import {AnchoredOverlayWrapperAnchorProps} from './AnchoredOverlay/AnchoredOverlay'
import {Divider} from './ActionList2/Divider'

type ActionMenuBaseProps = {
  /**
   * Recommended: `ActionMenu.Button` or `ActionMenu.Anchor` with ActionList`
   */
  children: React.ReactElement[] | React.ReactElement

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

/** we pass onClose down in the context for ActionList.Item */
type ContextProps = {listRole?: string; itemRole?: string; onClose?: () => void}
export const MenuContext = React.createContext<ContextProps>({})

const ActionMenuBase: React.FC<ActionMenuProps> = ({
  anchorRef: externalAnchorRef,
  open,
  setOpen,
  overlayProps,
  children
}: ActionMenuProps) => {
  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate(open, setOpen, false)
  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const onOpen = React.useCallback(() => setCombinedOpenState(true), [setCombinedOpenState])
  const onClose = React.useCallback(() => setCombinedOpenState(false), [setCombinedOpenState])

  let renderAnchor: AnchoredOverlayWrapperAnchorProps['renderAnchor'] = null
  const contents: React.ReactElement[] = []

  React.Children.map(children, child => {
    if (child.type === MenuButton || child.type === Anchor) {
      renderAnchor = anchorProps => React.cloneElement(child, anchorProps)
    } else {
      contents.push(child)
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
      <MenuContext.Provider value={{listRole: 'menu', itemRole: 'menuitem', onClose}}>{contents}</MenuContext.Provider>
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

ActionMenuBase.displayName = 'ActionMenu'
export const ActionMenu = Object.assign(ActionMenuBase, {Button: MenuButton, Anchor, Divider})
