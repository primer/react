import Flash from '../Flash'

export function shouldAcceptCallWithNoProps() {
  return <Flash />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Flash backgroundColor="thistle" />
}
