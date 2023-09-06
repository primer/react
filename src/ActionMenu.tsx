import React from 'react'
import {TriangleDownIcon} from '@primer/octicons-react'
import {AnchoredOverlay, AnchoredOverlayProps} from './AnchoredOverlay'
import {OverlayProps} from './Overlay'
import {useProvidedRefOrCreate, useProvidedStateOrCreate, useMenuKeyboardNavigation} from './hooks'
import {Divider} from './ActionList/Divider'
import {ActionListContainerContext} from './ActionList/ActionListContainerContext'
import {Button, ButtonProps} from './Button'
import {useId} from './hooks/useId'
import {MandateProps} from './utils/types'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from './utils/polymorphic'

export type MenuContextProps = Pick<
  AnchoredOverlayProps,
  'anchorRef' | 'renderAnchor' | 'open' | 'onOpen' | 'anchorId'
> & {
  onClose?: (gesture: 'anchor-click' | 'click-outside' | 'escape' | 'tab') => void
}
const MenuContext = React.createContext<MenuContextProps>({renderAnchor: null, open: false})

export type ActionMenuProps = {
  /**
   * Recommended: `ActionMenu.Button` or `ActionMenu.Anchor` with `ActionMenu.Overlay`
   */
  children: React.ReactElement[] | React.ReactElement

  /**
   * If defined, will control the open/closed state of the overlay. Must be used in conjunction with `onOpenChange`.
   */
  open?: boolean

  /**
   * If defined, will control the open/closed state of the overlay. Must be used in conjunction with `open`.
   */
  onOpenChange?: (s: boolean) => void
} & Pick<AnchoredOverlayProps, 'anchorRef'>

const Menu: React.FC<React.PropsWithChildren<ActionMenuProps>> = ({
  anchorRef: externalAnchorRef,
  open,
  onOpenChange,
  children,
}: ActionMenuProps) => {
  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate(open, onOpenChange, false)
  const onOpen = React.useCallback(() => setCombinedOpenState(true), [setCombinedOpenState])
  const onClose = React.useCallback(() => setCombinedOpenState(false), [setCombinedOpenState])

  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const anchorId = useId()
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

export type ActionMenuAnchorProps = {children: React.ReactElement}
const Anchor = React.forwardRef<HTMLElement, ActionMenuAnchorProps>(({children, ...anchorProps}, anchorRef) => {
  return React.cloneElement(children, {...anchorProps, ref: anchorRef})
})

/** this component is syntactical sugar 🍭 */
export type ActionMenuButtonProps = ButtonProps & {
  children: React.ReactNode
}
const MenuButton = React.forwardRef(({...props}, anchorRef) => {
  return (
    <Anchor ref={anchorRef}>
      <Button type="button" trailingAction={TriangleDownIcon} {...props} />
    </Anchor>
  )
}) as PolymorphicForwardRefComponent<'button', ActionMenuButtonProps>

type MenuOverlayProps = Partial<OverlayProps> &
  Pick<AnchoredOverlayProps, 'align'> & {
    /**
     * Recommended: `ActionList`
     */
    children: React.ReactNode
  }
const Overlay: React.FC<React.PropsWithChildren<MenuOverlayProps>> = ({
  children,
  align = 'start',
  'aria-labelledby': ariaLabelledby,
  ...overlayProps
}) => {
  // we typecast anchorRef as required instead of optional
  // because we know that we're setting it in context in Menu
  const {anchorRef, renderAnchor, anchorId, open, onOpen, onClose} = React.useContext(MenuContext) as MandateProps<
    MenuContextProps,
    'anchorRef'
  >

  const containerRef = React.useRef<HTMLDivElement>(null)
  useMenuKeyboardNavigation(open, onClose, containerRef, anchorRef)

  return (
    <AnchoredOverlay
      anchorRef={anchorRef}
      renderAnchor={renderAnchor}
      anchorId={anchorId}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      align={align}
      overlayProps={overlayProps}
      focusZoneSettings={{focusOutBehavior: 'wrap'}}
    >
      <div ref={containerRef}>
        <ActionListContainerContext.Provider
          value={{
            container: 'ActionMenu',
            listRole: 'menu',
            listLabelledBy: ariaLabelledby || anchorId,
            selectionAttribute: 'aria-checked', // Should this be here?
            afterSelect: onClose,
          }}
        >
          {children}
        </ActionListContainerContext.Provider>
      </div>
    </AnchoredOverlay>
  )
}

Menu.displayName = 'ActionMenu'
export const ActionMenu = Object.assign(Menu, {Button: MenuButton, Anchor, Overlay, Divider})
