import React from 'react'
import {BaseItem} from './BaseItem'
import {LinkItem} from './LinkItem'
import type {LinkProps, ActionListLinkItemProps} from './LinkItem'
import type {ActionListItemProps} from './shared'
import {ActionListContainerContext} from './ActionListContainerContext'
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
  const {container, listRole} = React.useContext(ActionListContainerContext)

  // Determine if we're in a menu context where links are not allowed
  const menuContext = container === 'ActionMenu' || container === 'SelectPanel' || container === 'FilteredActionList'
  const listboxContext = listRole === 'listbox' || listRole === 'menu'
  const invalidLinkContext = menuContext || listboxContext

  // If href is provided but we're in an invalid context, show a warning but allow it for backward compatibility
  if (href && invalidLinkContext) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn(
        `ActionList.Item with href in menu context (role="${listRole}", container="${container}") may have accessibility issues. ` +
          `Consider using onSelect with programmatic navigation instead. `,
      )
    }
  }

  // If href is provided OR we have a custom 'as' component (for Router-like components) and we're in a valid context, render as LinkItem
  // Also check for common Router props like 'to'
  const shouldUseLinkItem = href || restProps.to

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
