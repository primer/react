import {UnderlineNav} from '../../deprecated'

export function shouldAcceptCallWithNoProps() {
  return (
    <>
      <UnderlineNav />
      <UnderlineNav.Link />
    </>
  )
}

export function shouldNotAcceptSystemProps() {
  return (
    <>
      {/* @ts-expect-error system props should not be accepted */}
      <UnderlineNav backgroundColor="snow" />
      {/* @ts-expect-error system props should not be accepted */}
      <UnderlineNav.Link backgroundColor="springgreen" />
    </>
  )
}
