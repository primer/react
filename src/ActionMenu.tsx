import React from 'react'
import {useSSRSafeId} from '@react-aria/ssr'
import {TriangleDownIcon} from '@primer/octicons-react'
import {AnchoredOverlay, AnchoredOverlayProps} from './AnchoredOverlay'
import {OverlayProps} from './Overlay'
import {useProvidedRefOrCreate, useProvidedStateOrCreate, useMenuInitialFocus, useMnemonics} from './hooks'
import {Divider} from './ActionList/Divider'
import {ActionListContainerContext} from './ActionList/ActionListContainerContext'
import {Button, ButtonProps} from './Button'
import {MandateProps} from './utils/types'
import {SxProp, merge} from './sx'

type MenuContextProps = Pick<
  AnchoredOverlayProps,
  'anchorRef' | 'renderAnchor' | 'open' | 'onOpen' | 'onClose' | 'anchorId'
>
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
  children
}: ActionMenuProps) => {
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

export type ActionMenuAnchorProps = {children: React.ReactElement}
const Anchor = React.forwardRef<AnchoredOverlayProps['anchorRef'], ActionMenuAnchorProps>(
  ({children, ...anchorProps}, anchorRef) => {
    return React.cloneElement(children, {...anchorProps, ref: anchorRef})
  }
)

/** this component is syntactical sugar 🍭 */
export type ActionMenuButtonProps = ButtonProps
const MenuButton = React.forwardRef<AnchoredOverlayProps['anchorRef'], ButtonProps>(
  ({sx: sxProp = {}, ...props}, anchorRef) => {
    return (
      <Anchor ref={anchorRef}>
        <Button
          type="button"
          trailingIcon={TriangleDownIcon}
          sx={merge(
            {
              // override the margin on caret for optical alignment
              '[data-component=trailingIcon]': {marginX: -1}
            },
            sxProp as SxProp
          )}
          {...props}
        />
      </Anchor>
    )
  }
)

type MenuOverlayProps = Partial<OverlayProps> &
  Pick<AnchoredOverlayProps, 'align'> & {
    /**
     * Recommended: `ActionList`
     */
    children: React.ReactElement[] | React.ReactElement
  }
const Overlay: React.FC<React.PropsWithChildren<MenuOverlayProps>> = ({children, align = 'start', ...overlayProps}) => {
  // we typecast anchorRef as required instead of optional
  // because we know that we're setting it in context in Menu
  const {anchorRef, renderAnchor, anchorId, open, onOpen, onClose} = React.useContext(MenuContext) as MandateProps<
    MenuContextProps,
    'anchorRef'
  >

  const containerRef = React.createRef<HTMLDivElement>()
  const {openWithFocus} = useMenuInitialFocus(open, onOpen, containerRef)
  useMnemonics(open, containerRef)

  return (
    <AnchoredOverlay
      anchorRef={anchorRef}
      renderAnchor={renderAnchor}
      anchorId={anchorId}
      open={open}
      onOpen={openWithFocus}
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
            listLabelledBy: anchorId,
            selectionAttribute: 'aria-checked', // Should this be here?
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
export const ActionMenu = Object.assign(Menu, {Button: MenuButton, Anchor, Overlay, Divider})
