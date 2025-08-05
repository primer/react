import React from 'react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {ActionListContainerContext} from './ActionListContainerContext'
import {useSlots} from '../hooks/useSlots'
import {Heading} from './Heading'
import {useId} from '../hooks/useId'
import {ListContext, type ActionListProps} from './shared'
import {useProvidedRefOrCreate} from '../hooks'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

export const List = React.forwardRef<HTMLUListElement, ActionListProps>(
  (
    {variant = 'inset', selectionVariant, showDividers = false, role, disableFocusZone = false, className, ...props},
    forwardedRef,
  ): JSX.Element => {
    const [slots, childrenWithoutSlots] = useSlots(props.children, {
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
        <BoxWithFallback
          as="ul"
          className={clsx(classes.ActionList, className)}
          role={listRole}
          aria-labelledby={ariaLabelledBy}
          ref={listRef}
          data-dividers={showDividers}
          data-variant={variant}
          {...props}
        >
          {childrenWithoutSlots}
        </BoxWithFallback>
      </ListContext.Provider>
    )
  },
) as PolymorphicForwardRefComponent<'ul', ActionListProps>

List.displayName = 'ActionList'
