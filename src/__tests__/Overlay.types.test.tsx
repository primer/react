import React from 'react'
import Overlay from '../Overlay'

export function shouldAcceptCallWithNoProps(ref: React.RefObject<HTMLElement>) {
  return <Overlay returnFocusRef={ref} onClickOutside={() => null} onEscape={() => null} />
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
