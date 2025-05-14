import StateLabel from '../StateLabel'

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <StateLabel backgroundColor="bisque" />
}
