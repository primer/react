import CounterLabel from '../CounterLabel'

export function shouldAcceptCallWithNoProps() {
  return <CounterLabel />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <CounterLabel backgroundColor="whitesmoke" />
}
