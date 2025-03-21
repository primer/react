import React from 'react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import styled from 'styled-components'
import type {SxProp} from '../sx'
import sx, {merge} from '../sx'
import {ActionListContainerContext} from './ActionListContainerContext'
import {defaultSxProp} from '../utils/defaultSxProp'
import {useSlots} from '../hooks/useSlots'
import {Heading} from './Heading'
import {useId} from '../hooks/useId'
import {ListContext, type ActionListProps} from './shared'
import {useProvidedRefOrCreate} from '../hooks'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'

const ListBox = styled.ul<SxProp>(sx)

export const List = React.forwardRef<HTMLUListElement, ActionListProps>(
  (
    {variant = 'inset', selectionVariant, showDividers = false, role, sx: sxProp = defaultSxProp, className, ...props},
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
    } = React.useContext(ActionListContainerContext)

    const ariaLabelledBy = slots.heading ? (slots.heading.props.id ?? headingId) : listLabelledBy
    const listRole = role || listRoleFromContainer
    const listRef = useProvidedRefOrCreate(forwardedRef as React.RefObject<HTMLUListElement>)

    let enableFocusZone = false
    if (enableFocusZoneFromContainer !== undefined) enableFocusZone = enableFocusZoneFromContainer
    else if (listRole) enableFocusZone = ['menu', 'menubar', 'listbox'].includes(listRole)

    useFocusZone({
      disabled: !enableFocusZone,
      containerRef: listRef,
      bindKeys: FocusKeys.ArrowVertical | FocusKeys.HomeAndEnd | FocusKeys.PageUpDown,
      focusOutBehavior: listRole === 'menu' ? 'wrap' : undefined,
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
        {sxProp !== defaultSxProp ? (
          <ListBox
            sx={sxProp as SxProp}
            className={clsx(classes.ActionList, className)}
            role={listRole}
            aria-labelledby={ariaLabelledBy}
            ref={listRef}
            data-dividers={showDividers}
            data-variant={variant}
            {...props}
          >
            {childrenWithoutSlots}
          </ListBox>
        ) : (
          <ul
            className={clsx(classes.ActionList, className)}
            role={listRole}
            aria-labelledby={ariaLabelledBy}
            ref={listRef}
            data-dividers={showDividers}
            data-variant={variant}
            {...props}
          >
            {childrenWithoutSlots}
          </ul>
        )}
      </ListContext.Provider>
    )
  },
) as PolymorphicForwardRefComponent<'ul', ActionListProps>

List.displayName = 'ActionList'
