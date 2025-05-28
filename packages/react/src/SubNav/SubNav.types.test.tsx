import SubNav from '../SubNav'

export function shouldAcceptCallWithNoProps() {
  return (
    <>
      <SubNav />
      <SubNav.Link />
      <SubNav.Links />
    </>
  )
}

export function shouldNotAcceptSystemProps() {
  return (
    <>
      {/* @ts-expect-error system props should not be accepted */}
      <SubNav backgroundColor="thistle" />
      {/* @ts-expect-error system props should not be accepted */}
      <SubNav.Link backgroundColor="thistle" />
      {/* @ts-expect-error system props should not be accepted */}
      <SubNav.Links backgroundColor="thistle" />
    </>
  )
}
