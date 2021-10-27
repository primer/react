import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import Box from '../Box'
import {get} from '../constants'
import {SxProp, merge} from '../sx'

export type ListProps = {
  variant?: 'inset' | 'full'
  selectionVariant?: 'single' | 'multiple'
  showDividers?: boolean
} & SxProp

type ContextProps = Omit<ListProps, 'sx'>
export const ListContext = React.createContext<ContextProps>({})

export const List = React.forwardRef<HTMLUListElement, ListProps>(
  (
    {variant = 'inset', selectionVariant = 'single', showDividers = false, sx = {}, ...props},
    forwardedRef
  ): JSX.Element => {
    const styles = {
      margin: 0,
      fontSize: get('fontSizes.1'),
      lineHeight: '20px', // TODO: check if we replace this already
      paddingInlineStart: 0, // reset ul styles
      paddingY: variant === 'inset' ? get('space.2') : 0
    }

    return (
      <Box as="ul" sx={merge(styles, sx as SxProp)} {...props} ref={forwardedRef}>
        <ListContext.Provider value={{variant, selectionVariant, showDividers}}>{props.children}</ListContext.Provider>
      </Box>
    )
  }
) as PolymorphicForwardRefComponent<'ul', ListProps>

List.displayName = 'ActionList'
