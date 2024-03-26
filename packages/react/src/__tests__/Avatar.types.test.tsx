import React from 'react'
import Avatar from '../Avatar'

export function shouldNotAcceptCallWithNoProps() {
  // @ts-expect-error requires src prop
  return <Avatar />
}

export function shouldAcceptCallWithOnlySrcProp() {
  return <Avatar src="https://avatars.githubusercontent.com/primer" />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Avatar src="https://avatars.githubusercontent.com/primer" backgroundColor="thistle" />
}
