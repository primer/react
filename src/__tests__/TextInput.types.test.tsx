import React from 'react'
import {TextInput} from '..'

export function shouldNotAcceptInvalidDomProps() {
  // @ts-expect-error invalid DOM props should not be accepted
  return <TextInput onKeyDown={true} />
}
