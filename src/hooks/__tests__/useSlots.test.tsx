import {renderHook} from '@testing-library/react-hooks'
import React from 'react'
import {useSlots} from '../useSlots'

function TestComponentA(props: React.PropsWithChildren<unknown>) {
  return <div {...props} />
}

function TestComponentB(props: React.PropsWithChildren<unknown>) {
  return <div {...props} />
}

test('extracts elements based on config object', () => {
  const children = [<TestComponentA key="a" />, <TestComponentB key="b" />, <div key="hello">Hello World</div>]
  const slotsConfig = {
    a: TestComponentA,
    b: TestComponentB,
  }
  const {result} = renderHook(() => useSlots(children, slotsConfig))
  expect(result.current).toMatchInlineSnapshot(`
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
    ]
  `)
})

test('handles empty config object', () => {
  const children = [<TestComponentA key="a" />, <TestComponentB key="b" />, <div key="hello">Hello World</div>]
  const slotsConfig = {}
  const {result} = renderHook(() => useSlots(children, slotsConfig))
  expect(result.current).toMatchInlineSnapshot(`
    [
      {},
      [
        <TestComponentA />,
        <TestComponentB />,
        <div>
          Hello World
        </div>,
      ],
    ]
  `)
})

test('handles empty children', () => {
  const children: React.ReactNode = []
  const slotsConfig = {
    a: TestComponentA,
    b: TestComponentB,
  }
  const {result} = renderHook(() => useSlots(children, slotsConfig))
  expect(result.current).toMatchInlineSnapshot(`
    [
      {
        "a": undefined,
        "b": undefined,
      },
      [],
    ]
  `)
})

test('ignores nested slots', () => {
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
  const {result} = renderHook(() => useSlots(children, slotsConfig))
  expect(result.current).toMatchInlineSnapshot(`
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
    ]
  `)
})

test('warns about duplicate slots', () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const children = [<TestComponentA key="a1">A1</TestComponentA>, <TestComponentA key="a2">A2</TestComponentA>]
  const slotsConfig = {
    a: TestComponentA,
  }
  const {result} = renderHook(() => useSlots(children, slotsConfig))
  expect(result.current).toMatchInlineSnapshot(`
    [
      {
        "a": <TestComponentA>
          A1
        </TestComponentA>,
      },
      [],
    ]
  `)
  expect(warnSpy).toHaveBeenCalledTimes(1)
})
