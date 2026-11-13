import {createRef} from 'react'
import {expectTypeOf} from 'vitest'
import Timeline from '../Timeline'

export function shouldAcceptListRefs() {
  return (
    <Timeline ref={createRef<HTMLOListElement>()}>
      <Timeline.Item ref={createRef<HTMLLIElement>()} />
      <Timeline.Break ref={createRef<HTMLLIElement>()} />
    </Timeline>
  )
}

export function shouldInferListCallbackRefs() {
  return (
    <Timeline
      ref={node => {
        expectTypeOf(node).toEqualTypeOf<HTMLOListElement | null>()
      }}
    >
      <Timeline.Item
        ref={node => {
          expectTypeOf(node).toEqualTypeOf<HTMLLIElement | null>()
        }}
      />
      <Timeline.Break
        ref={node => {
          expectTypeOf(node).toEqualTypeOf<HTMLLIElement | null>()
        }}
      />
    </Timeline>
  )
}

export function shouldNotAcceptDivRefs() {
  const ref = createRef<HTMLDivElement>()
  return (
    <>
      {/* @ts-expect-error Timeline renders an ol, not a div */}
      <Timeline ref={ref} />
      {/* @ts-expect-error Timeline.Item renders an li, not a div */}
      <Timeline.Item ref={ref} />
      {/* @ts-expect-error Timeline.Break renders an li, not a div */}
      <Timeline.Break ref={ref} />
    </>
  )
}

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
