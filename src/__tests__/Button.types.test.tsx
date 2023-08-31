import {StopIcon} from '@primer/octicons-react'
import React, {useRef} from 'react'
import {Button, IconButton} from '../Button'

export function shouldAcceptOnlyAChildProp() {
  return <Button>child</Button>
}

export function ShouldAcceptKnownButtonPropsAndDomProps() {
  const buttonEl = useRef<HTMLButtonElement | null>(null)
  return (
    <Button
      ref={buttonEl}
      leadingIcon={() => <></>}
      trailingIcon={() => <></>}
      size="medium"
      variant="primary"
      disabled
      aria-label="Test label"
      onClick={e => {
        // current target is assignable to HTMLButtonElement
        buttonEl.current = e.currentTarget
      }}
      sx={{
        m: 1,
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

export function iconButtonRequiredProps() {
  return (
    <>
      <IconButton icon={StopIcon} aria-label="Stop icon" />
      <IconButton icon={StopIcon} aria-labelledby="Stop icon" />
    </>
  )
}

export function iconButtonShouldNotHaveLabelAndLabelledBy() {
  // @ts-expect-error aria-label and aria-labelledby should not be allowed together
  return <IconButton icon={StopIcon} aria-label="Stop icon" aria-labelledby="Stop icon" />
}

export function iconButtonRequiresAnIcon() {
  // @ts-expect-error icon is required
  return <IconButton aria-label="Stop icon" />
}

export function iconButtonOptionalProps() {
  return (
    <>
      <IconButton icon={StopIcon} aria-label="Stop icon" size="small" />
      <IconButton icon={StopIcon} aria-label="Stop icon" variant="danger" />
      <IconButton icon={StopIcon} aria-label="Stop icon" sx={{m: 1}} />
    </>
  )
}

export function iconButtonShouldNotAcceptOutlandishProps() {
  // @ts-expect-error system props should not be accepted
  return <Button icon={StopIcon} aria-label="Stop icon" anOutlandshPropThatShouldNotBeAllowedOnA={'Button'} />
}
