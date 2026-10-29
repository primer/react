import React from 'react'
import type {ForwardedRef} from 'react'
import type {WithSlotMarker} from '../utils/types/Slots'
import Link from '../Link'
import {Item} from './Item'
import type {ActionListItemProps} from './shared'
import {type PolymorphicProps, fixedForwardRef} from '../utils/modern-polymorphic'
import {Tooltip} from '../TooltipV2'

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
  className?: string
}

// LinkItem does not support selected, loading, variants, etc.
export type ActionListLinkItemProps = Pick<
  ActionListItemProps,
  'active' | 'children' | 'inactiveText' | 'variant' | 'size'
> &
  LinkProps

type LinkItemProps<As extends React.ElementType = 'a'> = PolymorphicProps<As, 'a', ActionListLinkItemProps> & {
  _PrivateTooltipText?: string
}

type LinkItemWrapperContextValue = {
  Component?: React.ElementType
  linkProps: React.ComponentPropsWithoutRef<'a'>
  inactiveText?: string
  forwardedRef: ForwardedRef<unknown>
  tooltipText?: string
}

const LinkItemWrapperContext = React.createContext<LinkItemWrapperContextValue | null>(null)

const LinkItemWrapper: NonNullable<ActionListItemProps['_PrivateItemWrapper']> = ({children, onClick, ...rest}) => {
  const context = React.useContext(LinkItemWrapperContext)
  if (!context) {
    throw new Error('LinkItemWrapper must be rendered within ActionList.LinkItem')
  }
  const {Component, linkProps, inactiveText, forwardedRef, tooltipText} = context

  const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
    onClick && onClick(event)
    linkProps.onClick && linkProps.onClick(event as React.MouseEvent<HTMLAnchorElement>)
  }
  if (inactiveText) {
    return <span {...rest}>{children}</span>
  }

  // Type safety for the polymorphic `as` prop is enforced at the
  // LinkItem boundary via fixedForwardRef. Internally we widen
  // Link's type so TypeScript doesn't re-check the generic
  // constraint across two polymorphic layers.
  const InternalLink: React.ElementType = Link
  const link = (
    <InternalLink
      as={Component}
      {...rest}
      {...linkProps}
      onClick={clickHandler}
      ref={tooltipText ? undefined : forwardedRef}
    >
      {children}
    </InternalLink>
  )

  return tooltipText ? (
    <Tooltip ref={forwardedRef as React.ForwardedRef<HTMLElement>} text={tooltipText} direction="e" delay="medium">
      {link}
    </Tooltip>
  ) : (
    link
  )
}

const LinkItemComponent = fixedForwardRef(
  <As extends React.ElementType = 'a'>(
    {active, inactiveText, variant, size, as: Component, className, _PrivateTooltipText, ...props}: LinkItemProps<As>,
    forwardedRef: ForwardedRef<unknown>,
  ) => {
    return (
      <LinkItemWrapperContext.Provider
        value={{
          Component,
          linkProps: props,
          inactiveText,
          forwardedRef,
          tooltipText: _PrivateTooltipText,
        }}
      >
        <Item
          className={className}
          active={active}
          inactiveText={inactiveText}
          data-inactive={inactiveText ? true : undefined}
          variant={variant}
          size={size}
          _PrivateItemWrapper={LinkItemWrapper}
        >
          {props.children}
        </Item>
      </LinkItemWrapperContext.Provider>
    )
  },
)

export const LinkItem: WithSlotMarker<typeof LinkItemComponent> = Object.assign(LinkItemComponent, {
  displayName: 'ActionList.LinkItem',
  __SLOT__: Symbol('ActionList.LinkItem'),
})
