import React from 'react'
import {ActionList} from './index'

export function shouldAcceptLinkItemAs() {
  return (
    <ActionList.LinkItem
      as="button"
      active
      variant="danger"
      size="small"
      disabled
      ref={React.createRef<HTMLButtonElement>()}
      onClick={event => {
        type Event = Expect<Equal<typeof event, React.MouseEvent<HTMLButtonElement>>>
      }}
    >
      Action
    </ActionList.LinkItem>
  )
}

const CustomLink = React.forwardRef<HTMLAnchorElement, {to: string; children?: React.ReactNode}>(
  ({to, children}, ref) => {
    return (
      <a href={to} ref={ref}>
        {children}
      </a>
    )
  },
)

export function shouldAcceptCustomLinkItemAs() {
  return <ActionList.LinkItem as={CustomLink} to="/example" ref={React.createRef<HTMLAnchorElement>()} />
}

export function shouldRequireCustomLinkItemProps() {
  // @ts-expect-error the custom component requires to
  return <ActionList.LinkItem as={CustomLink} />
}

export function shouldAcceptListAs() {
  return <ActionList as="ol" start={2} ref={React.createRef<HTMLOListElement>()} />
}

type Expect<T extends true> = T
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false
