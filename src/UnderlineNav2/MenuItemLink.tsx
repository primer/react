import React, {useContext} from 'react'
import Box from '../Box'
import CounterLabel from '../CounterLabel'
import {LoadingCounter} from './LoadingCounter'
import {ActionList} from '../ActionList'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {menuItemStyles} from './styles'
import {UnderlineNavContext} from './UnderlineNavContext'
import {UnderlineNavItemProps} from './UnderlineNavItem'

// Menu and the list items have the same props
export type MenuItemLinkProps = {
  onClick?: (event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => void
} & UnderlineNavItemProps

export const MenuItemLink = React.forwardRef<HTMLAnchorElement, MenuItemLinkProps>(
  ({children, counter, onSelect, 'aria-current': ariaCurrent, ...props}, forwardedRef) => {
    const {loadingCounters} = useContext(UnderlineNavContext)

    if (ariaCurrent === 'page' && children !== undefined) {
      // console.log('Selected menu item', children, 'on select function', onSelect)
      //   @ts-ignore
      // setSelectedLinkText(children)
      // call onClick function
      // create a new mouse event

      const event = new MouseEvent('click')
      // @ts-ignore
      if (typeof onSelect === 'function') onSelect(event)
      // @ts-ignore
      props.onClick?.(event)
    }

    return (
      // disable typescript error for now
      //   @ts-ignore
      <ActionList.LinkItem
        ref={forwardedRef}
        sx={menuItemStyles}
        active={false}
        onClick={(event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => {
          if (typeof onSelect === 'function') onSelect(event)
          props.onClick?.(event)
        }}
        {...props}
      >
        <Box as="span" sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          {children}

          {loadingCounters ? (
            <LoadingCounter />
          ) : (
            counter !== undefined && (
              <Box as="span" data-component="counter">
                <CounterLabel>{counter}</CounterLabel>
              </Box>
            )
          )}
        </Box>
      </ActionList.LinkItem>
    )
  },
) as PolymorphicForwardRefComponent<'a', MenuItemLinkProps>

MenuItemLink.displayName = 'UnderlineNav2.MenuItemLink'
