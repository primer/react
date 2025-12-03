import CircleBadge from '../CircleBadge'

export function shouldAcceptCallWithNoProps() {
  return <CircleBadge />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <CircleBadge backgroundColor="thistle" />
}
