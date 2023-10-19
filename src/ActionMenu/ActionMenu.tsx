import React from 'react'
import {TriangleDownIcon} from '@primer/octicons-react'
import {AnchoredOverlay, AnchoredOverlayProps} from '../AnchoredOverlay'
import {OverlayProps} from '../Overlay'
import {useProvidedRefOrCreate, useProvidedStateOrCreate, useMenuKeyboardNavigation} from '../hooks'
import {Divider} from '../ActionList/Divider'
import {ActionListContainerContext} from '../ActionList/ActionListContainerContext'
import {Button, ButtonProps} from '../Button'
import {useId} from '../hooks/useId'
import {MandateProps} from '../utils/types'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {Tooltip} from '../drafts/Tooltip/Tooltip'

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
  // 🚨 Accounting for Tooltip wrapping ActionMenu.Button or being a direct child of ActionMenu.Anchor.
  const contents = React.Children.map(children, child => {
    // Is ActionMenu.Button wrapped with Tooltip? If this is the case, our anchor is the tooltip's trigger (ActionMenu.Button's grandchild)
    if (child.type === Tooltip) {
      // tooltip trigger
      const anchorChildren = child.props.children
      if (anchorChildren.type === MenuButton) {
        renderAnchor = anchorProps => {
          // We need to attach the anchor props to the tooltip trigger (ActionMenu.Button's grandchild) not the tooltip itself.
          const triggerButton = React.cloneElement(anchorChildren, {...anchorProps})
          return React.cloneElement(child, {children: triggerButton, ref: anchorRef})
        }
      }
      return null
    } else if (child.type === Anchor) {
      const anchorChildren = child.props.children
      const isWrappedWithTooltip = anchorChildren !== undefined ? anchorChildren.type === Tooltip : false
      if (isWrappedWithTooltip) {
        if (anchorChildren.props.children !== null) {
          renderAnchor = anchorProps => {
            // ActionMenu.Anchor's children can be wrapped with Tooltip. If this is the case, our anchor is the tooltip's trigger
            const tooltipTrigger = anchorChildren.props.children
            // We need to attach the anchor props to the tooltip trigger not the tooltip itself.
            const tooltipTriggerEl = React.cloneElement(tooltipTrigger, {...anchorProps})
            const tooltip = React.cloneElement(anchorChildren, {children: tooltipTriggerEl})
            return React.cloneElement(child, {children: tooltip, ref: anchorRef})
          }
        }
      } else {
        renderAnchor = anchorProps => React.cloneElement(child, anchorProps)
      }
      return null
    } else if (child.type === MenuButton) {
      renderAnchor = anchorProps => React.cloneElement(child, anchorProps)
      return null
    } else {
      return child
    }
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
export type ActionMenuButtonProps = Omit<ButtonProps, 'children'> & {
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
  Pick<AnchoredOverlayProps, 'align' | 'side'> & {
    /**
     * Recommended: `ActionList`
     */
    children: React.ReactNode
  }
const Overlay: React.FC<React.PropsWithChildren<MenuOverlayProps>> = ({
  children,
  align = 'start',
  side = 'outside-bottom',
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
      side={side}
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
