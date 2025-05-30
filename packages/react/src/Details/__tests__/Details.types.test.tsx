import Details from '..'

export function shouldAcceptCallWithNoProps() {
  return <Details />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Details backgroundColor="thistle" />
}
