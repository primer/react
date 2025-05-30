import {render} from '@testing-library/react'
import {expect, test, vi} from 'vitest'
import type React from 'react'
import {useSlots} from '../useSlots'

type TestComponentAProps = React.PropsWithChildren<{variant?: 'a' | 'b'}>

function TestComponentA(props: TestComponentAProps) {
  return <div {...props} />
}

function TestComponentB(props: React.PropsWithChildren<unknown>) {
  return <div {...props} />
}

test('extracts elements based on config object', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []
  const children = [<TestComponentA key="a" />, <TestComponentB key="b" />, <div key="hello">Hello World</div>]
  const slotsConfig = {
    a: TestComponentA,
    b: TestComponentB,
  }

  function TestComponent(_props: {children: React.ReactNode}) {
    calls.push(useSlots(children, slotsConfig))
    return null
  }

  render(<TestComponent>{children}</TestComponent>)

  expect(calls).toMatchInlineSnapshot(`
    [
      [
        {
          "a": <TestComponentA />,
          "b": <TestComponentB />,
        },
        [
          <div>
            Hello World
          </div>,
        ],
      ],
    ]
  `)
})

test('handles empty config object', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []
  const children = [<TestComponentA key="a" />, <TestComponentB key="b" />, <div key="hello">Hello World</div>]
  const slotsConfig = {}

  function TestComponent(_props: {children: React.ReactNode}) {
    calls.push(useSlots(children, slotsConfig))
    return null
  }

  render(<TestComponent>{children}</TestComponent>)

  expect(calls).toMatchInlineSnapshot(`
    [
      [
        {},
        [
          <TestComponentA />,
          <TestComponentB />,
          <div>
            Hello World
          </div>,
        ],
      ],
    ]
  `)
})

test('handles empty children', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []
  const children: React.ReactNode = []
  const slotsConfig = {
    a: TestComponentA,
    b: TestComponentB,
  }

  function TestComponent(_props: {children: React.ReactNode}) {
    calls.push(useSlots(children, slotsConfig))
    return null
  }

  render(<TestComponent>{children}</TestComponent>)
  expect(calls).toMatchInlineSnapshot(`
    [
      [
        {
          "a": undefined,
          "b": undefined,
        },
        [],
      ],
    ]
  `)
})

test('ignores nested slots', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []
  const children = [
    <TestComponentA key="a" />,
    <div key="b">
      <TestComponentB />
    </div>,
  ]
  const slotsConfig = {
    a: TestComponentA,
    b: TestComponentB,
  }

  function TestComponent(_props: {children: React.ReactNode}) {
    calls.push(useSlots(children, slotsConfig))
    return null
  }

  render(<TestComponent>{children}</TestComponent>)

  expect(calls).toMatchInlineSnapshot(`
    [
      [
        {
          "a": <TestComponentA />,
          "b": undefined,
        },
        [
          <div>
            <TestComponentB />
          </div>,
        ],
      ],
    ]
  `)
})

test('warns about duplicate slots', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const children = [<TestComponentA key="a1">A1</TestComponentA>, <TestComponentA key="a2">A2</TestComponentA>]
  const slotsConfig = {
    a: TestComponentA,
  }

  function TestComponent(_props: {children: React.ReactNode}) {
    calls.push(useSlots(children, slotsConfig))
    return null
  }

  render(<TestComponent>{children}</TestComponent>)

  expect(calls).toMatchInlineSnapshot(`
    [
      [
        {
          "a": <TestComponentA>
            A1
          </TestComponentA>,
        },
        [],
      ],
    ]
  `)
  expect(warnSpy).toHaveBeenCalledTimes(1)
})

test('extracts elements based on condition in config object', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []
  const children = [
    <TestComponentA key="a" variant="a" />,
    <TestComponentA key="b" variant="b" />,
    <div key="hello">Hello World</div>,
  ]

  function TestComponent(_props: {children: React.ReactNode}) {
    calls.push(
      useSlots(children, {
        a: [TestComponentA, (props: TestComponentAProps) => props.variant === 'a'],
        b: [TestComponentA, (props: TestComponentAProps) => props.variant === 'b'],
      }),
    )
    return null
  }

  render(<TestComponent>{children}</TestComponent>)

  expect(calls).toMatchInlineSnapshot(`
    [
      [
        {
          "a": <TestComponentA
            variant="a"
          />,
          "b": <TestComponentA
            variant="b"
          />,
        },
        [
          <div>
            Hello World
          </div>,
        ],
      ],
    ]
  `)
})
