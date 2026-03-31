import Timeline from '../Timeline'

export function shouldAcceptCallWithNoProps() {
  return (
    <>
      <Timeline />
      <Timeline.Item />
      <Timeline.Badge />
      <Timeline.Body />
      <Timeline.Break />
    </>
  )
}

export function shouldAcceptClipSidebarValues() {
  return (
    <>
      <Timeline clipSidebar />
      <Timeline clipSidebar={true} />
      <Timeline clipSidebar={false} />
      <Timeline clipSidebar="start" />
      <Timeline clipSidebar="end" />
      <Timeline clipSidebar="both" />
    </>
  )
}

export function shouldNotAcceptInvalidClipSidebarValues() {
  return (
    <>
      {/* @ts-expect-error invalid string value should not be accepted */}
      <Timeline clipSidebar="invalid" />
    </>
  )
}

export function shouldNotAcceptSystemProps() {
  return (
    <>
      {/* @ts-expect-error system props should not be accepted */}
      <Timeline backgroundColor="red" />
      {/* @ts-expect-error system props should not be accepted */}
      <Timeline.Item backgroundColor="orange" />
      {/* @ts-expect-error system props should not be accepted */}
      <Timeline.Badge backgroundColor="yellow" />
      {/* @ts-expect-error system props should not be accepted */}
      <Timeline.Body backgroundColor="green" />
      {/* @ts-expect-error system props should not be accepted */}
      <Timeline.Break backgroundColor="blue" />
    </>
  )
}
