import SideNav from '../SideNav'

export function shouldAcceptCallWithNoProps() {
  return <SideNav />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <SideNav backgroundColor="aliceblue" />
}
