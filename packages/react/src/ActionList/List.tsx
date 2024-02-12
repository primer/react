import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import styled from 'styled-components'
import sx, {SxProp, merge} from '../sx'
import {ActionListContainerContext} from './ActionListContainerContext'
import {defaultSxProp} from '../utils/defaultSxProp'
import {useSlots} from '../hooks/useSlots'
import {Heading} from './Heading'
import {useId} from '../hooks/useId'
import {ListContext, type ActionListProps} from './shared'

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
      listRole,
      listLabelledBy,
      selectionVariant: containerSelectionVariant, // TODO: Remove after DropdownMenu2 deprecation
    } = React.useContext(ActionListContainerContext)

    const ariaLabelledBy = slots.heading ? slots.heading.props.id ?? headingId : listLabelledBy

    return (
      <ListContext.Provider
        value={{
          variant,
          selectionVariant: selectionVariant || containerSelectionVariant,
          showDividers,
          role: role || listRole,
          headingId,
        }}
      >
        {slots.heading}
        <ListBox
          sx={merge(styles, sxProp as SxProp)}
          role={role || listRole}
          aria-labelledby={ariaLabelledBy}
          {...props}
          ref={forwardedRef}
        >
          {childrenWithoutSlots}
        </ListBox>
      </ListContext.Provider>
    )
  },
) as PolymorphicForwardRefComponent<'ul', ActionListProps>

List.displayName = 'ActionList'
