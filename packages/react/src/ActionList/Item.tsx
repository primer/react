import React from 'react'
import {BaseItem} from './BaseItem'
import {LinkItem} from './LinkItem'
import type {LinkProps, ActionListLinkItemProps} from './LinkItem'
import type {ActionListItemProps} from './shared'
import {fixedForwardRef} from '../utils/modern-polymorphic'

// Export SubItem from BaseItem for backward compatibility
export {SubItem} from './BaseItem'

// Combine Item props with optional link props - defaults to 'li' | 'a' to support both use cases
export type ActionListCombinedItemProps<As extends React.ElementType = 'li' | 'a'> = ActionListItemProps<As> & LinkProps

const UnwrappedItem = <As extends React.ElementType = 'li' | 'a'>(
  props: ActionListCombinedItemProps<As>,
  forwardedRef: React.Ref<HTMLElement>,
) => {
  const {href, target, rel, download, hrefLang, media, ping, type, referrerPolicy, ...restProps} = props

  // If href is provided OR we have a custom 'as' component (for Router-like components), render as LinkItem
  // Also check for common Router props like 'to'
  const shouldUseLinkItem = href || restProps.to || restProps.as === 'a'

  if (shouldUseLinkItem) {
    const linkProps = {
      download,
      href,
      hrefLang,
      media,
      ping,
      rel,
      target,
      type,
      referrerPolicy,
      ...restProps, // This includes the 'as' prop for polymorphic components
    } as ActionListLinkItemProps

    return <LinkItem ref={forwardedRef as React.RefObject<HTMLAnchorElement>} {...linkProps} />
  }

  const itemProps = {
    ref: forwardedRef,
    ...restProps,
  } as ActionListItemProps

  return <BaseItem {...itemProps} />
}

/**
 * A unified ActionList item that can function as either a button-like item or a link,
 * depending on whether an href prop is provided. This component automatically chooses
 * the appropriate implementation while enforcing accessibility constraints.
 */
const Item = fixedForwardRef(UnwrappedItem)

Object.assign(Item, {displayName: 'ActionList.Item'})

export {Item}
