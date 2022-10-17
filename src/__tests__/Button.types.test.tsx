import React from 'react'
import {Button} from '../Button'

export function shouldAcceptOnlyAChildProp() {
  return <Button>child</Button>
}

export function shouldNotAcceptOutlandishProps() {
  // @ts-expect-error system props should not be accepted
  return <Button anOutlandshPropThatShouldNotBeAllowedOnA={'Button'} />
}
