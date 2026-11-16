import Avatar from '../Avatar'

export function shouldAcceptCallWithNoProps() {
  return <Avatar src="https://avatars.githubusercontent.com/u/7143434?v=4" />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Avatar src="https://avatars.githubusercontent.com/u/7143434?v=4" backgroundColor="thistle" />
}
