import React, {useContext} from 'react'
import Box from '../Box'
import sx, {merge, BetterSystemStyleObject, SxProp} from '../sx'

import CounterLabel from '../CounterLabel'

import {LoadingCounter} from './LoadingCounter'

import {ActionList} from '../ActionList'
import {defaultSxProp} from '../utils/defaultSxProp'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {moreBtnStyles, getDividerStyle, getNavStyles, ulStyles, menuStyles, menuItemStyles, GAP} from './styles'
import {IconProps} from '@primer/octicons-react'
import {UnderlineNavContext} from './UnderlineNavContext'

// adopted from React.AnchorHTMLAttributes
type LinkProps = {
  download?: string
  href?: string
  hrefLang?: string
  media?: string
  ping?: string
  rel?: string
  target?: string
  type?: string
  referrerPolicy?: React.AnchorHTMLAttributes<HTMLAnchorElement>['referrerPolicy']
}
export type MenuItemLinkProps = {
  /**
   * Primary content for an UnderlineNav
   */
  children?: React.ReactNode
  /**
   * Counter
   */
  counter?: number | string
} & SxProp &
  LinkProps

export const MenuItemLink = React.forwardRef<HTMLAnchorElement, MenuItemLinkProps>(
  ({children, counter, sx: sxProp = defaultSxProp, ...props}, forwardedRef) => {
    const {loadingCounters} = useContext(UnderlineNavContext)

    return (
      // disable typescript error for now
      //   @ts-ignore
      <ActionList.LinkItem ref={forwardedRef} sx={menuItemStyles} active={false} {...props}>
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
