import React, {useCallback, useContext, useMemo, useEffect, useState} from 'react'
import {TriangleDownIcon, ChevronRightIcon} from '@primer/octicons-react'
import type {AnchoredOverlayProps} from '../AnchoredOverlay'
import {AnchoredOverlay} from '../AnchoredOverlay'
import type {OverlayProps} from '../Overlay'
import {useProvidedRefOrCreate, useProvidedStateOrCreate, useMenuKeyboardNavigation} from '../hooks'
import {Divider} from '../ActionList/Divider'
import {ActionListContainerContext} from '../ActionList/ActionListContainerContext'
import type {ButtonProps} from '../Button'
import type {AnchorPosition} from '@primer/behaviors'
import {Button} from '../Button'
import {useId} from '../hooks/useId'
import type {MandateProps} from '../utils/types'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import styles from './ActionMenu.module.css'
import {useResponsiveValue, type ResponsiveValue} from '../hooks/useResponsiveValue'

export type MenuCloseHandler = (
  gesture: 'anchor-click' | 'click-outside' | 'escape' | 'tab' | 'item-select' | 'arrow-left' | 'close',
) => void

export type MenuContextProps = Pick<
  AnchoredOverlayProps,
  'anchorRef' | 'renderAnchor' | 'open' | 'onOpen' | 'anchorId'
> & {
  onClose?: MenuCloseHandler
  isSubmenu?: boolean
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

// anchorProps adds onClick and onKeyDown, so we need to merge them with buttonProps
const mergeAnchorHandlers = (anchorProps: React.HTMLAttributes<HTMLElement>, buttonProps: ButtonProps) => {
  const mergedAnchorProps = {...anchorProps}

  if (typeof buttonProps.onClick === 'function') {
    const anchorOnClick = anchorProps.onClick
    const mergedOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      buttonProps.onClick?.(event)
      anchorOnClick?.(event)
    }
    mergedAnchorProps.onClick = mergedOnClick
  }

  if (typeof buttonProps.onKeyDown === 'function') {
    const anchorOnKeyDown = anchorProps.onKeyDown
    const mergedOnAnchorKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      buttonProps.onKeyDown?.(event)
      anchorOnKeyDown?.(event)
    }
    mergedAnchorProps.onKeyDown = mergedOnAnchorKeyDown
  }

  return mergedAnchorProps
}

const Menu: React.FC<React.PropsWithChildren<ActionMenuProps>> = ({
  anchorRef: externalAnchorRef,
  open,
  onOpenChange,
  children,
}: ActionMenuProps) => {
  const parentMenuContext = useContext(MenuContext)

  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate(open, onOpenChange, false)
  const onOpen = React.useCallback(() => setCombinedOpenState(true), [setCombinedOpenState])
  const isNarrow = useResponsiveValue({narrow: true}, false)
  const onClose: MenuCloseHandler = React.useCallback(
    gesture => {
      if (isNarrow && open && gesture === 'tab') {
        return
      }
      setCombinedOpenState(false)
      // Close the parent stack when an item is selected or the user tabs out of the menu entirely
      switch (gesture) {
        case 'tab':
        case 'item-select':
          parentMenuContext.onClose?.(gesture)
      }
    },
    [setCombinedOpenState, parentMenuContext, open, isNarrow],
  )

  const menuButtonChild = React.Children.toArray(children).find(
    child =>
      React.isValidElement<ActionMenuButtonProps>(child) &&
      typeof child.type === 'function' &&
      'displayName' in child.type &&
      (child.type.displayName === 'ActionMenu.Button' || child.type.displayName === 'ActionMenu.Anchor'),
  )
  const menuButtonChildId = React.isValidElement(menuButtonChild) ? menuButtonChild.props.id : undefined

  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const anchorId = useId(menuButtonChildId)
  let renderAnchor: AnchoredOverlayProps['renderAnchor'] = null
  // 🚨 Hack for good API!
  // we strip out Anchor from children and pass it to AnchoredOverlay to render
  // with additional props for accessibility
  // 🚨 Accounting for Tooltip wrapping ActionMenu.Button or being a direct child of ActionMenu.Anchor.
  const contents = React.Children.map(children, child => {
    // Is ActionMenu.Button wrapped with Tooltip? If this is the case, our anchor is the tooltip's trigger (ActionMenu.Button's grandchild)
    if (typeof child.type === 'function' && 'displayName' in child.type && child.type.displayName === 'Tooltip') {
      // tooltip trigger
      const anchorChildren = child.props.children
      if (
        typeof anchorChildren.type === 'function' &&
        'displayName' in anchorChildren.type &&
        anchorChildren.type.displayName === 'ActionMenu.Button'
      ) {
        // eslint-disable-next-line react-compiler/react-compiler
        renderAnchor = anchorProps => {
          // We need to attach the anchor props to the tooltip trigger (ActionMenu.Button's grandchild) not the tooltip itself.
          const triggerButton = React.cloneElement(
            anchorChildren,
            mergeAnchorHandlers({...anchorProps}, anchorChildren.props),
          )
          return React.cloneElement(child, {children: triggerButton, ref: anchorRef})
        }
      }
      return null
    } else if (
      typeof child.type === 'function' &&
      'displayName' in child.type &&
      child.type.displayName === 'ActionMenu.Anchor'
    ) {
      const anchorChildren = child.props.children
      const isWrappedWithTooltip =
        anchorChildren !== undefined
          ? typeof anchorChildren.type === 'function' &&
            'displayName' in anchorChildren.type &&
            anchorChildren.type.displayName === 'Tooltip'
          : false
      if (isWrappedWithTooltip) {
        if (anchorChildren.props.children !== null) {
          renderAnchor = anchorProps => {
            // ActionMenu.Anchor's children can be wrapped with Tooltip. If this is the case, our anchor is the tooltip's trigger
            const tooltipTrigger = anchorChildren.props.children
            // We need to attach the anchor props to the tooltip trigger not the tooltip itself.
            const tooltipTriggerEl = React.cloneElement(
              tooltipTrigger,
              mergeAnchorHandlers({...anchorProps}, tooltipTrigger.props),
            )
            const tooltip = React.cloneElement(anchorChildren, {children: tooltipTriggerEl})
            return React.cloneElement(child, {children: tooltip, ref: anchorRef})
          }
        }
      } else {
        renderAnchor = anchorProps => React.cloneElement(child, anchorProps)
      }
      return null
    } else if (
      typeof child.type === 'function' &&
      'displayName' in child.type &&
      child.type.displayName === 'ActionMenu.Button'
    ) {
      renderAnchor = anchorProps => React.cloneElement(child, mergeAnchorHandlers(anchorProps, child.props))
      return null
    } else {
      return child
    }
  })

  return (
    <MenuContext.Provider
      value={{
        anchorRef,
        renderAnchor,
        anchorId,
        open: combinedOpenState,
        onOpen,
        onClose,
        // will be undefined for the outermost level, then false for the top menu, then true inside that
        isSubmenu: parentMenuContext.isSubmenu !== undefined,
      }}
    >
      {contents}
    </MenuContext.Provider>
  )
}

export type ActionMenuAnchorProps = {children: React.ReactElement; id?: string} & React.HTMLAttributes<HTMLElement>
const Anchor = React.forwardRef<HTMLElement, ActionMenuAnchorProps>(({children: child, ...anchorProps}, anchorRef) => {
  const {onOpen, isSubmenu} = React.useContext(MenuContext)

  const openSubmenuOnRightArrow: React.KeyboardEventHandler<HTMLElement> = useCallback(
    event => {
      if (isSubmenu && event.key === 'ArrowRight' && !event.defaultPrevented) onOpen?.('anchor-key-press')
    },
    [isSubmenu, onOpen],
  )

  const onButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    child.props.onClick?.(event)
    anchorProps.onClick?.(event) // onClick is passed from AnchoredOverlay
  }

  const onButtonKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    child.props.onKeyDown?.(event)
    openSubmenuOnRightArrow(event)
    anchorProps.onKeyDown?.(event) // onKeyDown is passed from AnchoredOverlay
  }

  // Add right chevron icon to submenu anchors rendered using `ActionList.Item`
  const parentActionListContext = useContext(ActionListContainerContext)
  const thisActionListContext = useMemo(
    () =>
      isSubmenu
        ? {
            ...parentActionListContext,
            defaultTrailingVisual: <ChevronRightIcon />,
            // Default behavior is to close after selecting; we want to open the submenu instead
            afterSelect: () => onOpen?.('anchor-click'),
          }
        : parentActionListContext,
    [isSubmenu, onOpen, parentActionListContext],
  )

  return (
    <ActionListContainerContext.Provider value={thisActionListContext}>
      {React.cloneElement(child, {
        ...anchorProps,
        ref: anchorRef,
        onClick: onButtonClick,
        onKeyDown: onButtonKeyDown,
      })}
    </ActionListContainerContext.Provider>
  )
})

/** this component is syntactical sugar 🍭 */
export type ActionMenuButtonProps = ButtonProps

const MenuButton = React.forwardRef(({...props}, anchorRef) => {
  return (
    <Anchor ref={anchorRef}>
      <Button type="button" trailingAction={TriangleDownIcon} {...props} />
    </Anchor>
  )
}) as PolymorphicForwardRefComponent<'button', ActionMenuButtonProps>

const defaultVariant: ResponsiveValue<'anchored', 'anchored' | 'fullscreen'> = {
  regular: 'anchored',
  narrow: 'anchored',
}

type MenuOverlayProps = Partial<OverlayProps> &
  Pick<AnchoredOverlayProps, 'align' | 'side' | 'variant'> & {
    /**
     * Recommended: `ActionList`
     */
    children: React.ReactNode
    onPositionChange?: ({position}: {position: AnchorPosition}) => void
  }
const Overlay: React.FC<React.PropsWithChildren<MenuOverlayProps>> = ({
  children,
  align = 'start',
  side,
  onPositionChange,
  'aria-labelledby': ariaLabelledby,
  variant = defaultVariant,
  ...overlayProps
}) => {
  // we typecast anchorRef as required instead of optional
  // because we know that we're setting it in context in Menu
  const {
    anchorRef,
    renderAnchor,
    anchorId,
    open,
    onOpen,
    onClose,
    isSubmenu = false,
  } = React.useContext(MenuContext) as MandateProps<MenuContextProps, 'anchorRef'>

  const containerRef = React.useRef<HTMLDivElement>(null)
  useMenuKeyboardNavigation(open, onClose, containerRef, anchorRef, isSubmenu)
  const isNarrow = useResponsiveValue({narrow: true}, false)
  const responsiveVariant = useResponsiveValue(variant, {regular: 'anchored', narrow: 'anchored'})

  const isNarrowFullscreen = !!isNarrow && variant.narrow === 'fullscreen'

  // If the menu anchor is an icon button, we need to label the menu by tooltip that also labelled the anchor.
  const [anchorAriaLabelledby, setAnchorAriaLabelledby] = useState<null | string>(null)
  useEffect(() => {
    // Necessary for HMR reloads
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (anchorRef?.current) {
      const ariaLabelledby = anchorRef.current.getAttribute('aria-labelledby')
      if (ariaLabelledby) {
        setAnchorAriaLabelledby(ariaLabelledby)
      }
    }
  }, [anchorRef])

  return (
    <AnchoredOverlay
      anchorRef={anchorRef}
      renderAnchor={renderAnchor}
      anchorId={anchorId}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      align={align}
      side={side ?? (isSubmenu ? 'outside-right' : 'outside-bottom')}
      overlayProps={overlayProps}
      focusZoneSettings={isNarrowFullscreen ? {disabled: true} : {focusOutBehavior: 'wrap'}}
      onPositionChange={onPositionChange}
      variant={variant}
    >
      <div ref={containerRef} className={styles.ActionMenuContainer} data-variant={responsiveVariant}>
        <ActionListContainerContext.Provider
          value={{
            container: 'ActionMenu',
            listRole: 'menu',
            // If there is a custom aria-labelledby, use that. Otherwise, if exists, use the id that labels the anchor such as tooltip. If none of them exist, use anchor id.
            listLabelledBy: ariaLabelledby || anchorAriaLabelledby || anchorId,
            selectionAttribute: 'aria-checked', // Should this be here?
            afterSelect: () => onClose?.('item-select'),
            enableFocusZone: isNarrowFullscreen, // AnchoredOverlay takes care of focus zone. We only want to enable this if menu is narrow fullscreen.
          }}
        >
          {children}
        </ActionListContainerContext.Provider>
      </div>
    </AnchoredOverlay>
  )
}

Menu.displayName = 'ActionMenu'
MenuButton.displayName = 'ActionMenu.Button'
Anchor.displayName = 'ActionMenu.Anchor'
export const ActionMenu = Object.assign(Menu, {Button: MenuButton, Anchor, Overlay, Divider})
