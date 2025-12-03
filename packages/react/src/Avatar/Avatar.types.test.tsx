import Avatar from '../Avatar'

export function shouldAcceptCallWithNoProps() {
  return <Avatar src="https://avatars.githubusercontent.com/primer" />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Avatar src="https://avatars.githubusercontent.com/primer" backgroundColor="thistle" />
}
