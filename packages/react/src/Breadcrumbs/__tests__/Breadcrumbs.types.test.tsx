import Breadcrumbs from '../Breadcrumbs'

export function shouldAcceptCallWithNoProps() {
  return (
    <>
      <Breadcrumbs />
      <Breadcrumbs.Item />
    </>
  )
}

export function shouldNotAcceptSystemProps() {
  return (
    <>
      {/* @ts-expect-error system props should not be accepted */}
      <Breadcrumbs backgroundColor="maroon" />
      {/* @ts-expect-error system props should not be accepted */}
      <Breadcrumbs.Item backgroundColor="fuchsia" />
    </>
  )
}
