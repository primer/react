import React, {type JSX} from 'react'
import {fixedForwardRef} from '../utils/modern-polymorphic'
import {ActionListContainerContext} from './ActionListContainerContext'
import {useSlots} from '../hooks/useSlots'
import {Heading} from './Heading'
import {useId} from '../hooks/useId'
import {ListContext, type ActionListProps} from './shared'
import {useProvidedRefOrCreate} from '../hooks'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'

/**
 * Detects if the list has a mix of items with and without descriptions.
 * Sets a data attribute on the list element to enable CSS styling.
 * This replaces an expensive double :has() CSS selector that would scan all items twice.
 */
function useMixedDescriptions(listRef: React.RefObject<HTMLElement | null>) {
  useIsomorphicLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    const updateMixedDescriptions = () => {
      const items = list.querySelectorAll('[data-has-description]')
      let hasWithDescription = false
      let hasWithoutDescription = false

      for (const item of items) {
        const value = item.getAttribute('data-has-description')
        if (value === 'true') hasWithDescription = true
        if (value === 'false') hasWithoutDescription = true
        if (hasWithDescription && hasWithoutDescription) break
      }

      const hasMixed = hasWithDescription && hasWithoutDescription
      if (hasMixed) {
        list.setAttribute('data-has-mixed-descriptions', 'true')
      } else {
        list.removeAttribute('data-has-mixed-descriptions')
      }
    }

    // Initial check
    updateMixedDescriptions()

    // Observe for changes to handle dynamic item additions/removals
    const observer = new MutationObserver(updateMixedDescriptions)
    observer.observe(list, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-has-description'],
    })

    return () => observer.disconnect()
  }, [listRef])
}

const UnwrappedList = <As extends React.ElementType = 'ul'>(
  props: ActionListProps<As>,
  forwardedRef: React.Ref<unknown>,
): JSX.Element => {
  const {
    as: Component = 'ul',
    variant = 'inset',
    selectionVariant,
    showDividers = false,
    role,
    disableFocusZone = false,
    className,
    ...restProps
  } = props
  const [slots, childrenWithoutSlots] = useSlots(restProps.children, {
    heading: Heading,
  })

  const headingId = useId()

  /** if list is inside a Menu, it will get a role from the Menu */
  const {
    listRole: listRoleFromContainer,
    listLabelledBy,
    selectionVariant: containerSelectionVariant, // TODO: Remove after DropdownMenu2 deprecation
    enableFocusZone: enableFocusZoneFromContainer,
    container,
  } = React.useContext(ActionListContainerContext)

  const ariaLabelledBy = slots.heading ? (slots.heading.props.id ?? headingId) : listLabelledBy
  const listRole = role || listRoleFromContainer
  const listRef = useProvidedRefOrCreate(forwardedRef as React.RefObject<HTMLUListElement>)

  let enableFocusZone = false
  if (enableFocusZoneFromContainer !== undefined) enableFocusZone = enableFocusZoneFromContainer
  else if (listRole && !disableFocusZone) enableFocusZone = ['menu', 'menubar', 'listbox'].includes(listRole)

  useFocusZone({
    disabled: !enableFocusZone,
    containerRef: listRef,
    bindKeys: FocusKeys.ArrowVertical | FocusKeys.HomeAndEnd | FocusKeys.PageUpDown,
    focusOutBehavior:
      listRole === 'menu' || container === 'SelectPanel' || container === 'FilteredActionList' ? 'wrap' : undefined,
  })

  // Detect mixed descriptions and set data attribute (replaces expensive :has() CSS selector)
  useMixedDescriptions(listRef)

  return (
    <ListContext.Provider
      value={{
        variant,
        selectionVariant: selectionVariant || containerSelectionVariant,
        showDividers,
        role: listRole,
        headingId,
      }}
    >
      {slots.heading}
      {/* @ts-expect-error ref needs a non nullable ref */}
      <Component
        className={clsx(classes.ActionList, className)}
        role={listRole}
        aria-labelledby={ariaLabelledBy}
        ref={listRef}
        data-dividers={showDividers}
        data-variant={variant}
        {...restProps}
      >
        {childrenWithoutSlots}
      </Component>
    </ListContext.Provider>
  )
}

const List = fixedForwardRef(UnwrappedList)

Object.assign(List, {displayName: 'ActionList'})

export {List}
