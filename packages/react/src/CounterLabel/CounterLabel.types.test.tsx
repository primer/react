import React, {useRef} from 'react'
import CounterLabel from '../CounterLabel'

export function shouldAcceptCallWithNoProps() {
  return <CounterLabel />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <CounterLabel backgroundColor="whitesmoke" />
}

export function showAcceptARef() {
  function Component() {
    const ref = useRef<HTMLSpanElement>(null)
    return <CounterLabel ref={ref} />
  }
  return <Component />
}

export function shouldPassThroughSpanProps() {
  return <CounterLabel data-testid="test value" aria-label="Test label" />
}
