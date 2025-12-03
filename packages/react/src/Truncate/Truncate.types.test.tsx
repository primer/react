import Truncate from '../Truncate'

export function shouldAcceptCallWithNoProps() {
  return <Truncate title="Hello" />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Truncate title="Hello" backgroundColor="indigo" />
}
