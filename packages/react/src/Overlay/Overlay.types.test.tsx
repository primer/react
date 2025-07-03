import type React from 'react'
import Overlay from './Overlay'

export function shouldAcceptCallWithNoProps(ref: React.RefObject<HTMLElement>) {
  return <Overlay returnFocusRef={ref} onClickOutside={() => null} onEscape={() => null} />
}

export function shouldAcceptCallWithDOMProps(ref: React.RefObject<HTMLElement>) {
  return <Overlay returnFocusRef={ref} onClickOutside={() => null} onEscape={() => null} onMouseDown={() => null} />
}

export function shouldNotAcceptCallWithDOMPropsThatDontMatchElement(ref: React.RefObject<HTMLElement>) {
  // @ts-expect-error href should not be allowed on a <div>
  return <Overlay returnFocusRef={ref} onClickOutside={() => null} onEscape={() => null} href="//primer.style/" />
}

export function shouldAcceptCallWithAsAndDOMProps(ref: React.RefObject<HTMLElement>) {
  return (
    <Overlay as="a" returnFocusRef={ref} onClickOutside={() => null} onEscape={() => null} href="//primer.style/" />
  )
}

export function shouldNotAcceptSystemProps(ref: React.RefObject<HTMLElement>) {
  return (
    <Overlay
      returnFocusRef={ref}
      onClickOutside={() => null}
      onEscape={() => null}
      // @ts-expect-error system props should not be accepted
      backgroundColor="olivedrab"
    />
  )
}
