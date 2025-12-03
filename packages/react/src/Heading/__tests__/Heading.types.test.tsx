import Heading from '../Heading'

export function shouldAcceptCallWithNoProps() {
  return <Heading />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Heading backgroundColor="thistle" />
}

export function shouldNotAcceptInvalidAsProp() {
  // @ts-expect-error as prop should not be accepted
  return <Heading as="p" />
}
