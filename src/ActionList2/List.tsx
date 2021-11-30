import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import styled from 'styled-components'
import sx, {SxProp, merge} from '../sx'
import {AriaRole} from '../utils/types'

export type ListProps = {
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
} & SxProp

type ContextProps = Pick<ListProps, 'variant' | 'selectionVariant' | 'showDividers'>
export const ListContext = React.createContext<ContextProps>({})

const ListBox = styled.ul<SxProp>(sx)

export const List = React.forwardRef<HTMLUListElement, ListProps>(
  (
    {variant = 'inset', selectionVariant, showDividers = false, sx: sxProp = {}, ...props},
    forwardedRef
  ): JSX.Element => {
    const styles = {
      margin: 0,
      paddingInlineStart: 0, // reset ul styles
      paddingY: variant === 'inset' ? 2 : 0
    }

    return (
      <ListBox sx={merge(styles, sxProp as SxProp)} {...props} ref={forwardedRef}>
        <ListContext.Provider value={{variant, selectionVariant, showDividers}}>{props.children}</ListContext.Provider>
      </ListBox>
    )
  }
) as PolymorphicForwardRefComponent<'ul', ListProps>

List.displayName = 'ActionList'
