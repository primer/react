import React from 'react'
import {TextInput} from '..'

export function shouldNotAcceptInvalidDomProps() {
  // @ts-expect-error invalid DOM props should not be accepted
  return <TextInput onKeyDown={true} />
}

export function shouldNotAcceptInvalidSize() {
  // @ts-expect-error invalid size value should not be accepted
  return <TextInput size="big" />
}
