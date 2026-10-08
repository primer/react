import Truncate from '../Truncate'
import Link from '../Link'

export function shouldAcceptCallWithNoProps() {
  return <Truncate title="Hello" />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Truncate title="Hello" backgroundColor="indigo" />
}

export function shouldAcceptIntrinsicElementPropsFromAs() {
  return <Truncate as="a" href="https://github.com" title="Hello" />
}

export function shouldNotAcceptPropsNotSupportedByAs() {
  // @ts-expect-error `href` is not a valid prop for a div
  return <Truncate as="div" href="https://github.com" title="Hello" />
}

export function shouldAcceptComponentPropsFromAs() {
  return <Truncate as={Link} href="https://github.com" title="Hello" maxWidth={600} inline muted />
}

export function shouldNotAcceptUnknownPropsForComponentAs() {
  // @ts-expect-error `unknownProp` is not a valid prop for Link
  return <Truncate as={Link} href="https://github.com" title="Hello" unknownProp />
}

export function shouldRequireTitleWithAs() {
  // @ts-expect-error `title` is required
  return <Truncate as={Link} href="https://github.com" />
}

export function shouldInferEventTypesFromAs() {
  return <Truncate as="button" title="Hello" onClick={event => event.currentTarget.disabled} />
}
