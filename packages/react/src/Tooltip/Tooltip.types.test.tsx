import Tooltip from '../Tooltip/Tooltip'

/* Tooltip v1 */

export function shouldAcceptCallWithNoProps() {
  return <Tooltip />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Tooltip backgroundColor="thistle" />
}
