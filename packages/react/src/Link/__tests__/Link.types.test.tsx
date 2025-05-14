import Link from '../Link'

export function shouldAcceptCallWithNoProps() {
  return <Link />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Link backgroundColor="mistyrose" />
}
