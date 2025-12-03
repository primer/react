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
