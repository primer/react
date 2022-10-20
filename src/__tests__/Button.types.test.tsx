import React, {useRef} from 'react'
import {Button} from '../Button'

export function shouldAcceptOnlyAChildProp() {
  return <Button>child</Button>
}

export function ShouldAcceptKnownButtonPropsAndDomProps() {
  const buttonEl = useRef<HTMLButtonElement>()
  return (
    <Button
      ref={buttonEl}
      leadingIcon={() => <></>}
      trailingIcon={() => <></>}
      size="medium"
      variant="primary"
      disabled
      aria-label="some label"
      onClick={e => {
        // current target is assignable to HTMLButtonElement
        buttonEl.current = e.currentTarget
      }}
      sx={{
        m: 1
      }}
    >
      Child
    </Button>
  )
}

export function shouldNotAcceptOutlandishProps() {
  // @ts-expect-error system props should not be accepted
  return <Button anOutlandshPropThatShouldNotBeAllowedOnA={'Button'} />
}
