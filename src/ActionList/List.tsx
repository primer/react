import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import styled from 'styled-components'
import sx, {SxProp, merge} from '../sx'
import {AriaRole} from '../utils/types'
import {ActionListContainerContext} from './ActionListContainerContext'
import {defaultSxProp} from '../utils/defaultSxProp'
import {Heading} from './Heading'
import Box from '../Box'
import {useSlots} from '../hooks/useSlots'
import {useId} from '../hooks/useId'

export type ActionListProps = React.PropsWithChildren<{
  /**
   * `inset` children are offset (vertically and horizontally) from `List`’s edges, `full` children are flush (vertically and horizontally) with `List` edges
   */
  variant?: 'inset' | 'full'
  /**
   * Whether multiple Items or a single Item can be selected.
   */
  selectionVariant?: 'single' | 'multiple'
  /**
   * Display a divider above each `Item` in this `List` when it does not follow a `Header` or `Divider`.
   */
  showDividers?: boolean
  /**
   * The ARIA role describing the function of `List` component. `listbox` or `menu` are a common values.
   */
  role?: AriaRole
}> &
  SxProp

type ContextProps = Pick<ActionListProps, 'variant' | 'selectionVariant' | 'showDividers' | 'role'> & {
  headingId?: string
}

export const ListContext = React.createContext<ContextProps>({})

const ListBox = styled.ul<SxProp>(sx)

export const List = React.forwardRef<HTMLUListElement, ActionListProps>(
  (
    {variant = 'inset', selectionVariant, showDividers = false, role, sx: sxProp = defaultSxProp, ...props},
    forwardedRef,
  ): JSX.Element => {
    const outerStyles = {
      paddingY: variant === 'inset' ? 2 : 0,
    }

    const innerStyles = {
      margin: 0,
      paddingInlineStart: 0, // reset ul styles
    }

    /** if list is inside a Menu, it will get a role from the Menu */
    const {
      listRole,
      listLabelledBy,
      selectionVariant: containerSelectionVariant, // TODO: Remove after DropdownMenu2 deprecation
    } = React.useContext(ActionListContainerContext)

    const [slots, rest] = useSlots(props.children, {heading: Heading})

    const headingId = useId()

    return (
      <Box sx={merge(outerStyles, sxProp as SxProp)}>
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
            sx={innerStyles}
            role={role || listRole}
            aria-labelledby={slots.heading ? headingId : listLabelledBy}
            {...props}
            ref={forwardedRef}
          >
            {rest}
          </ListBox>
        </ListContext.Provider>
      </Box>
    )
  },
) as PolymorphicForwardRefComponent<'ul', ActionListProps>

List.displayName = 'ActionList'
