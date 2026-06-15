import {useId, useState, type KeyboardEvent, type MouseEvent, type ReactEventHandler, type SyntheticEvent} from 'react'

type MenuActionDetails = {
  event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>
  value: string
}

type MenuCloseDetails = {
  event: KeyboardEvent<HTMLElement>
  reason: 'escape' | 'tab'
}

type UseMenuOptions = {
  defaultActiveValue?: string
  menuId?: string
  onAction?: (details: MenuActionDetails) => void
  onClose?: (details: MenuCloseDetails) => void
  triggerId?: string
}

type MenuItemOptions = {
  disabled?: boolean
  value: string
}

function useMenu({
  defaultActiveValue,
  menuId: menuIdProp,
  onAction,
  onClose,
  triggerId: triggerIdProp,
}: UseMenuOptions = {}) {
  const generatedId = useId()
  const [active, setActive] = useState<string | null>(defaultActiveValue ?? null)
  const [open, setOpen] = useState(false)
  const menuId = menuIdProp ?? `${generatedId}-menu`
  const triggerId = triggerIdProp ?? `${generatedId}-trigger`

  function getMenuTriggerProps() {
    return {
      'aria-controls': menuId,
      'aria-expanded': open,
      'aria-haspopup': 'menu' as const,
      id: triggerId,
      onClick(event: MouseEvent<HTMLElement>) {
        if (!open && event.detail === 0) {
          const popover = getPopoverFromTrigger(event.currentTarget)

          if (popover) {
            focusMenuItemInPopover(popover, 'first')
          }
        }
      },
      onKeyDown(event: KeyboardEvent<HTMLElement>) {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
          return
        }

        event.preventDefault()
        const popover = getPopoverFromTrigger(event.currentTarget)

        if (!popover) {
          return
        }

        if (!popover.matches(':popover-open')) {
          popover.showPopover()
          setOpen(true)
        }

        focusMenuItemInPopover(popover, event.key === 'ArrowDown' ? 'first' : 'last')
      },
    }
  }

  function getPopoverProps() {
    return {
      onToggle: ((event: SyntheticEvent<HTMLElement>) => {
        setOpen(event.currentTarget.matches(':popover-open'))
      }) as ReactEventHandler<HTMLElement>,
    }
  }

  function getMenuProps() {
    return {
      id: menuId,
      role: 'menu',
      onKeyDown(event: KeyboardEvent<HTMLElement>) {
        const menuItems = getMenuItemElements(event.currentTarget)

        if (event.key === 'ArrowDown') {
          event.preventDefault()
          focusMenuItem(menuItems, getNextMenuItemIndex(event.currentTarget, menuItems, 1))
        } else if (event.key === 'ArrowUp') {
          event.preventDefault()
          focusMenuItem(menuItems, getNextMenuItemIndex(event.currentTarget, menuItems, -1))
        } else if (event.key === 'Home') {
          event.preventDefault()
          focusMenuItem(menuItems, 0)
        } else if (event.key === 'End') {
          event.preventDefault()
          focusMenuItem(menuItems, menuItems.length - 1)
        } else if (event.key === 'Escape') {
          event.preventDefault()
          closeMenu(event.currentTarget, {restoreFocus: true, triggerId})
          onClose?.({event, reason: 'escape'})
        } else if (event.key === 'Tab') {
          closeMenu(event.currentTarget, {restoreFocus: false, triggerId})
          onClose?.({event, reason: 'tab'})
        } else if (isPrintableCharacter(event)) {
          const activeIndex = getActiveMenuItemIndex(event.currentTarget, menuItems)
          const nextItem = findNextMenuItemByLabel(menuItems, activeIndex, event.key)

          if (nextItem) {
            event.preventDefault()
            nextItem.focus()
          }
        }
      },
    }
  }

  function getMenuItemProps({disabled = false, value}: MenuItemOptions) {
    function activateItem(event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>) {
      if (disabled) {
        event.preventDefault()
        return
      }

      onAction?.({event, value})
      closeMenu(event.currentTarget, {restoreFocus: true, triggerId})
    }

    return {
      'aria-disabled': disabled || undefined,
      'data-active': active === value ? 'true' : undefined,
      'data-menu-value': value,
      role: 'menuitem',
      tabIndex: active === value ? 0 : -1,
      onClick(event: MouseEvent<HTMLElement>) {
        activateItem(event)
      },
      onFocus() {
        setActive(value)
      },
      onKeyDown(event: KeyboardEvent<HTMLElement>) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          activateItem(event)
        }
      },
    }
  }

  return {
    getMenuItemProps,
    getMenuProps,
    getMenuTriggerProps,
    getPopoverProps,
  }
}

function getPopoverFromTrigger(trigger: HTMLElement) {
  const popoverId = trigger.getAttribute('commandfor')

  if (!popoverId) {
    return null
  }

  const popover = trigger.ownerDocument.getElementById(popoverId)
  return popover instanceof HTMLElement ? popover : null
}

function closeMenu(target: HTMLElement, {restoreFocus, triggerId}: {restoreFocus: boolean; triggerId: string}) {
  const popover = target.closest('[popover]')

  if (popover instanceof HTMLElement && popover.matches(':popover-open')) {
    popover.hidePopover()
  }
  if (restoreFocus) {
    const trigger = target.ownerDocument.getElementById(triggerId)

    if (trigger instanceof HTMLElement) {
      trigger.focus()
    }
  }
}

function focusMenuItemInPopover(popover: HTMLElement, placement: 'first' | 'last') {
  const menuItems = getMenuItemElements(popover)
  const menuItem = placement === 'first' ? menuItems[0] : menuItems.at(-1)

  setTimeout(() => menuItem?.focus())
}

function getMenuItemElements(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'),
  ).filter((item): item is HTMLElement => item instanceof HTMLElement)
}

function getActiveMenuItemIndex(root: HTMLElement, menuItems: Array<HTMLElement>) {
  const focusedIndex = menuItems.findIndex(menuItem => menuItem === root.ownerDocument.activeElement)

  if (focusedIndex !== -1) {
    return focusedIndex
  }

  return menuItems.findIndex(menuItem => menuItem.getAttribute('data-active') === 'true')
}

function getNextMenuItemIndex(root: HTMLElement, menuItems: Array<HTMLElement>, offset: 1 | -1) {
  if (menuItems.length === 0) {
    return -1
  }

  const activeIndex = getActiveMenuItemIndex(root, menuItems)

  if (activeIndex === -1) {
    return offset === 1 ? 0 : menuItems.length - 1
  }

  return (activeIndex + offset + menuItems.length) % menuItems.length
}

function focusMenuItem(menuItems: Array<HTMLElement>, index: number) {
  menuItems[index]?.focus()
}

function findNextMenuItemByLabel(menuItems: Array<HTMLElement>, activeIndex: number, key: string) {
  const normalizedKey = key.toLocaleLowerCase()
  const orderedMenuItems = [...menuItems.slice(activeIndex + 1), ...menuItems.slice(0, activeIndex + 1)]

  return orderedMenuItems.find(menuItem => menuItem.textContent.trim().toLocaleLowerCase().startsWith(normalizedKey))
}

function isPrintableCharacter(event: KeyboardEvent<HTMLElement>) {
  return event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey && event.key !== ' '
}

export {useMenu}
