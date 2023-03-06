import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import styled from 'styled-components'
import sx, {SxProp, merge} from '../sx'
import {AriaRole} from '../utils/types'
import {ActionListContainerContext} from './ActionListContainerContext'
import {defaultSxProp} from '../utils/defaultSxProp'
import {useId} from '../hooks/useId'
import {Heading, ActionListHeadingProps} from './Heading'
import Box from '../Box'
import { argv0 } from 'process'

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
  /**
   * Optional heading title to display at top of the list.
   */
  headingProps?: ActionListHeadingProps
}> &
  SxProp

type ContextProps = Pick<ActionListProps, 'variant' | 'selectionVariant' | 'showDividers' | 'role'>
export const ListContext = React.createContext<ContextProps>({})

const ListBox = styled.ul<SxProp>(sx)

export const List = React.forwardRef<HTMLUListElement, ActionListProps>(
  (
    {
      variant = 'inset',
      selectionVariant,
      showDividers = false,
      role,
      headingProps,
      sx: sxProp = defaultSxProp,
      ...props
    },
    forwardedRef,
  ): JSX.Element => {
    const outerStyles = {
      paddingY: variant === 'inset' ? 2 : 0
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

    const id = useId()
    if (headingProps) {
      headingProps.id = id
    }

    return (
      <Box sx={outerStyles}>
        {headingProps && <Heading {...headingProps} />}
        <ListBox
          sx={merge(innerStyles, sxProp as SxProp)}
          role={role || listRole}
          aria-labelledby={headingProps ? id : listLabelledBy}
          {...props}
          ref={forwardedRef}
        >
          <ListContext.Provider
            value={{
              variant,
              selectionVariant: selectionVariant || containerSelectionVariant,
              showDividers,
              role: role || listRole,
            }}
          >
            {props.children}
          </ListContext.Provider>
        </ListBox>
      </Box>
    )
  },
) as PolymorphicForwardRefComponent<'ul', ActionListProps>

List.displayName = 'ActionList'
