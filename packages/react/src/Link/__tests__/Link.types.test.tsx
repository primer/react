import React from 'react'
import Link from '../Link'

export function shouldAcceptCallWithNoProps() {
  return <Link />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Link backgroundColor="mistyrose" />
}

export function shouldAcceptButtonProps() {
  return (
    <Link
      as="button"
      muted
      disabled
      ref={React.createRef<HTMLButtonElement>()}
      onClick={event => {
        type Event = Expect<Equal<typeof event, React.MouseEvent<HTMLButtonElement>>>
      }}
    />
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

export function shouldAcceptCustomComponentProps() {
  return <Link as={CustomLink} to="/example" inline ref={React.createRef<HTMLAnchorElement>()} />
}

export function shouldRequireCustomComponentProps() {
  // @ts-expect-error the custom component requires to
  return <Link as={CustomLink} />
}

export function shouldRejectIncorrectRef() {
  // @ts-expect-error a button requires a button ref
  return <Link as="button" ref={React.createRef<HTMLAnchorElement>()} />
}

type Expect<T extends true> = T
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false
