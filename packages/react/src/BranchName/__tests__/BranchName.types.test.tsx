import React from 'react'
import BranchName from '../BranchName'

export function shouldAcceptCallWithNoProps() {
  return <BranchName />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <BranchName backgroundColor="thistle" />
}

export function shouldAcceptAs() {
  return (
    <BranchName
      as="button"
      onClick={event => {
        type test = Expect<Equal<typeof event, React.MouseEvent<HTMLButtonElement, MouseEvent>>>
      }}
    />
  )
}

export function defaultAsIsAnchor() {
  return (
    <BranchName
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        type test = Expect<Equal<typeof event, React.MouseEvent<HTMLAnchorElement, MouseEvent>>>
      }}
    />
  )
}

export function ShouldAcceptRef() {
  const ref = React.useRef<HTMLButtonElement>(null)
  return (
    <BranchName
      as="button"
      ref={ref}
      onClick={event => {
        type test = Expect<Equal<typeof event, React.MouseEvent<HTMLButtonElement, MouseEvent>>>
      }}
    />
  )
}

type Expect<T extends true> = T
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false
