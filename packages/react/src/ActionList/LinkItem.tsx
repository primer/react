import type React from 'react'
import type {ForwardedRef} from 'react'
import type {WithSlotMarker} from '../utils/types/Slots'
import Link from '../Link'
import {Item} from './Item'
import type {ActionListItemProps} from './shared'
import {type PolymorphicProps, fixedForwardRef} from '../utils/modern-polymorphic'

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

type LinkItemProps<As extends React.ElementType = 'a'> = PolymorphicProps<As, 'a', ActionListLinkItemProps>

const LinkItemComponent = fixedForwardRef(
  <As extends React.ElementType = 'a'>(
    {active, inactiveText, variant, size, as: Component, className, ...props}: LinkItemProps<As>,
    forwardedRef: ForwardedRef<unknown>,
  ) => {
    return (
      <Item
        className={className}
        active={active}
        inactiveText={inactiveText}
        data-inactive={inactiveText ? true : undefined}
        variant={variant}
        size={size}
        _PrivateItemWrapper={({children, onClick, ...rest}) => {
          const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
            onClick && onClick(event)
            props.onClick && props.onClick(event as React.MouseEvent<HTMLAnchorElement>)
          }
          if (inactiveText) {
            return <span {...rest}>{children}</span>
          }

          // Type safety for the polymorphic `as` prop is enforced at the
          // LinkItem boundary via fixedForwardRef. Internally we widen
          // Link's type so TypeScript doesn't re-check the generic
          // constraint across two polymorphic layers.
          const InternalLink: React.ElementType = Link
          return (
            <InternalLink as={Component} {...rest} {...props} onClick={clickHandler} ref={forwardedRef}>
              {children}
            </InternalLink>
          )
        }}
      >
        {props.children}
      </Item>
    )
  },
)

export const LinkItem: WithSlotMarker<typeof LinkItemComponent> = Object.assign(LinkItemComponent, {
  displayName: 'ActionList.LinkItem',
  __SLOT__: Symbol('ActionList.LinkItem'),
})
