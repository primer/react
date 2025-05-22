import LabelGroup from '../LabelGroup'

export function shouldAcceptCallWithNoProps() {
  return <LabelGroup />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <LabelGroup backgroundColor="khaki" />
}
