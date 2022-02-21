import React from 'react'
import {useSSRSafeId} from '@react-aria/ssr'
import {TriangleDownIcon} from '@primer/octicons-react'
import {Button, ButtonProps} from './Button2'
import {AnchoredOverlay, AnchoredOverlayProps} from './AnchoredOverlay'
import {OverlayProps} from './Overlay'
import {useProvidedRefOrCreate, useProvidedStateOrCreate, useMenuInitialFocus} from './hooks'
import {Divider} from './ActionList2/Divider'
import {ActionListContainerContext} from './ActionList2/ActionListContainerContext'
import {MandateProps} from './utils/types'

type MenuContextProps = Pick<
  AnchoredOverlayProps,
  'anchorRef' | 'renderAnchor' | 'open' | 'onOpen' | 'onClose' | 'anchorId'
>
const MenuContext = React.createContext<MenuContextProps>({renderAnchor: null, open: false})

export type DropdownMenuProps = {
  /**
   * Recommended: `ActionMenu.Button` or `ActionMenu.Anchor` with `ActionMenu.Overlay`
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
} & Pick<AnchoredOverlayProps, 'anchorRef'>

const Menu: React.FC<DropdownMenuProps> = ({
  anchorRef: externalAnchorRef,
  open,
  onOpenChange,
  children
}: DropdownMenuProps) => {
  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate(open, onOpenChange, false)
  const onOpen = React.useCallback(() => setCombinedOpenState(true), [setCombinedOpenState])
  const onClose = React.useCallback(() => setCombinedOpenState(false), [setCombinedOpenState])

  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const anchorId = useSSRSafeId()
  let renderAnchor: AnchoredOverlayProps['renderAnchor'] = null

  // 🚨 Hack for good API!
  // we strip out Anchor from children and pass it to AnchoredOverlay to render
  // with additional props for accessibility
  const contents = React.Children.map(children, child => {
    if (child.type === MenuButton || child.type === Anchor) {
      renderAnchor = anchorProps => React.cloneElement(child, anchorProps)
      return null
    }
    return child
  })

  return (
    <MenuContext.Provider value={{anchorRef, renderAnchor, anchorId, open: combinedOpenState, onOpen, onClose}}>
      {contents}
    </MenuContext.Provider>
  )
}

export type DropdownMenuAnchorProps = {children: React.ReactElement}
const Anchor = React.forwardRef<AnchoredOverlayProps['anchorRef'], DropdownMenuAnchorProps>(
  ({children, ...anchorProps}, anchorRef) => {
    return React.cloneElement(children, {...anchorProps, ref: anchorRef})
  }
)

/** this component is syntactical sugar 🍭 */
export type DropdownMenuButtonProps = ButtonProps
const MenuButton = React.forwardRef<AnchoredOverlayProps['anchorRef'], ButtonProps>(
  ({children, ...props}, anchorRef) => {
    return (
      <Anchor ref={anchorRef}>
        <Button trailingIcon={TriangleDownIcon} type="button" {...props}>
          {children}
        </Button>
      </Anchor>
    )
  }
)

type MenuOverlayProps = Partial<OverlayProps> & {
  /**
   * Recommended: `ActionList`
   */
  children: React.ReactElement[] | React.ReactElement
}
const Overlay: React.FC<MenuOverlayProps> = ({children, ...overlayProps}) => {
  // we typecast anchorRef as required instead of optional
  // because we know that we're setting it in context in Menu
  const {anchorRef, renderAnchor, anchorId, open, onOpen, onClose} = React.useContext(MenuContext) as MandateProps<
    MenuContextProps,
    'anchorRef'
  >

  const {containerRef, openWithFocus} = useMenuInitialFocus(open, onOpen)

  return (
    <AnchoredOverlay
      anchorRef={anchorRef}
      renderAnchor={renderAnchor}
      anchorId={anchorId}
      open={open}
      onOpen={openWithFocus}
      onClose={onClose}
      overlayProps={overlayProps}
      focusZoneSettings={{focusOutBehavior: 'wrap'}}
    >
      <div ref={containerRef}>
        <ActionListContainerContext.Provider
          value={{
            container: 'DropdownMenu',
            listRole: 'menu',
            listLabelledBy: anchorId,
            selectionVariant: 'single',
            selectionAttribute: 'aria-checked',
            afterSelect: onClose
          }}
        >
          {children}
        </ActionListContainerContext.Provider>
      </div>
    </AnchoredOverlay>
  )
}

Menu.displayName = 'ActionMenu'
export const DropdownMenu = Object.assign(Menu, {Button: MenuButton, Anchor, Overlay, Divider})
