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

  const listContextValue = React.useMemo(
    () => ({
      variant,
      selectionVariant: selectionVariant || containerSelectionVariant,
      showDividers,
      role: listRole,
      headingId,
    }),
    [variant, selectionVariant, containerSelectionVariant, showDividers, listRole, headingId],
  )

  // Replaces a CSS `:has([data-has-description])` selector that caused full-subtree
  // style recalculation on every DOM mutation (~674ms on 100 items, 10-20s freezes on Safari).
  //
  // Ideally we'd derive this from children during render, but each Item's description is
  // detected via `useSlots` at render time, so the List can't know which Items have
  // descriptions without duplicating slot detection or deeply inspecting children trees
  // (fragile with Groups, conditional rendering, wrapper components, etc.).
  //
  // A context-based approach (Items registering their description state with the List) would
  // work but adds registration/unregistration callbacks, a new provider, and re-renders when
  // the count changes. Not worth the complexity for a derived boolean.
  //
  // Two querySelector calls after render is trivially cheap compared to what the browser
  // was doing on every DOM mutation with `:has()`.
  useIsomorphicLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const hasMixed =
      list.querySelector('[data-has-description="true"]') !== null &&
      list.querySelector('[data-has-description="false"]') !== null
    const current = list.getAttribute('data-mixed-descriptions')
    if (hasMixed && current !== 'true') {
      list.setAttribute('data-mixed-descriptions', 'true')
    } else if (!hasMixed && current !== null) {
      list.removeAttribute('data-mixed-descriptions')
    }
  })

  return (
    <ListContext.Provider value={listContextValue}>
      {slots.heading}
      {/* @ts-expect-error ref needs a non nullable ref */}
      <Component
        className={clsx(classes.ActionList, className)}
        role={listRole}
        aria-labelledby={ariaLabelledBy}
        ref={listRef}
        data-component="ActionList"
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
