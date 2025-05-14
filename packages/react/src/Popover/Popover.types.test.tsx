import Popover from '../Popover'

export function shouldAcceptCallWithNoProps() {
  return <Popover />
}

export function shouldNotAcceptSystemProps() {
  return (
    <>
      {/* @ts-expect-error system props should not be accepted */}
      <Popover backgroundColor="palegreen" />
      {/* @ts-expect-error system props should not be accepted */}
      <Popover.Content backgroundColor="paleturquoise" />
    </>
  )
}
