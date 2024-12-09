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

const ListBox = styled.ul<SxProp>(sx)

export const List = React.forwardRef<HTMLUListElement, ActionListProps>(
  (
    {variant = 'inset', selectionVariant, showDividers = false, role, sx: sxProp = defaultSxProp, ...props},
    forwardedRef,
  ): JSX.Element => {
    const styles = {
      margin: 0,
      paddingInlineStart: 0, // reset ul styles
      paddingY: variant === 'inset' ? 2 : 0,
    }

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

    const ariaLabelledBy = slots.heading ? slots.heading.props.id ?? headingId : listLabelledBy
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
        <ListBox
          sx={merge(styles, sxProp as SxProp)}
          role={listRole}
          aria-labelledby={ariaLabelledBy}
          {...props}
          ref={listRef}
        >
          {childrenWithoutSlots}
        </ListBox>
      </ListContext.Provider>
    )
  },
) as PolymorphicForwardRefComponent<'ul', ActionListProps>

List.displayName = 'ActionList'
