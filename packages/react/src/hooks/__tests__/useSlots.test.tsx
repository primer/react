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

// Test components with slot symbols
function TestComponentWithSlot(props: React.PropsWithChildren<unknown>) {
  return <div {...props} />
}

// @ts-ignore - TypeScript doesn't know about the __SLOT__ property
TestComponentWithSlot.__SLOT__ = Symbol('TestComponentWithSlot')

function TestComponentWithSlotVariant(props: TestComponentAProps) {
  return <div {...props} />
}

// @ts-ignore - TypeScript doesn't know about the __SLOT__ property
TestComponentWithSlotVariant.__SLOT__ = Symbol('TestComponentWithSlotVariant')

// Wrapper components that use the slot symbol from the original component
const WrappedTestComponentA = () => (
  <div>
    <TestComponentA>Wrapped A</TestComponentA>
  </div>
)

// @ts-ignore - TypeScript doesn't know about the __SLOT__ property
WrappedTestComponentA.__SLOT__ = TestComponentA.__SLOT__

const WrappedTestComponentWithSlot = () => (
  <div>
    <TestComponentWithSlot>Wrapped with slot</TestComponentWithSlot>
  </div>
)

// @ts-ignore - TypeScript doesn't know about the __SLOT__ property
WrappedTestComponentWithSlot.__SLOT__ = TestComponentWithSlot.__SLOT__

const WrappedTestComponentWithSlotVariant = (props: TestComponentAProps) => (
  <div>
    <TestComponentWithSlotVariant {...props}>Wrapped variant</TestComponentWithSlotVariant>
  </div>
)

// @ts-ignore - TypeScript doesn't know about the __SLOT__ property
WrappedTestComponentWithSlotVariant.__SLOT__ = TestComponentWithSlotVariant.__SLOT__

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

test('extracts components using slot symbols', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []
  const children = [
    <TestComponentWithSlot key="slot">Slot content</TestComponentWithSlot>,
    <TestComponentB key="b">Regular B</TestComponentB>,
    <div key="hello">Hello World</div>,
  ]
  const slotsConfig = {
    slotComponent: TestComponentWithSlot,
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
          "b": <TestComponentB>
            Regular B
          </TestComponentB>,
          "slotComponent": <TestComponentWithSlot>
            Slot content
          </TestComponentWithSlot>,
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

test('extracts wrapped components using slot symbols', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []
  const children = [
    <WrappedTestComponentWithSlot key="wrapped" />,
    <TestComponentB key="b">Regular B</TestComponentB>,
    <div key="hello">Hello World</div>,
  ]
  const slotsConfig = {
    slotComponent: TestComponentWithSlot,
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
          "b": <TestComponentB>
            Regular B
          </TestComponentB>,
          "slotComponent": <WrappedTestComponentWithSlot />,
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

test('extracts wrapped components with slot symbols and conditions', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []
  const children = [
    <WrappedTestComponentWithSlotVariant key="variant-a" variant="a" />,
    <WrappedTestComponentWithSlotVariant key="variant-b" variant="b" />,
    <div key="hello">Hello World</div>,
  ]

  function TestComponent(_props: {children: React.ReactNode}) {
    calls.push(
      useSlots(children, {
        variantA: [TestComponentWithSlotVariant, (props: TestComponentAProps) => props.variant === 'a'],
        variantB: [TestComponentWithSlotVariant, (props: TestComponentAProps) => props.variant === 'b'],
      }),
    )
    return null
  }

  render(<TestComponent>{children}</TestComponent>)

  expect(calls).toMatchInlineSnapshot(`
    [
      [
        {
          "variantA": <WrappedTestComponentWithSlotVariant
            variant="a"
          />,
          "variantB": <WrappedTestComponentWithSlotVariant
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

test('prefers direct component type match over slot symbol match', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []
  const children = [
    <TestComponentWithSlot key="direct">Direct component</TestComponentWithSlot>,
    <WrappedTestComponentWithSlot key="wrapped" />,
    <div key="hello">Hello World</div>,
  ]
  const slotsConfig = {
    slotComponent: TestComponentWithSlot,
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
          "slotComponent": <TestComponentWithSlot>
            Direct component
          </TestComponentWithSlot>,
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

test('handles components without slot symbols in mixed scenarios', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []
  const children = [
    <TestComponentA key="a">Component A</TestComponentA>,
    <WrappedTestComponentA key="wrapped" />,
    <TestComponentWithSlot key="slot">Slot component</TestComponentWithSlot>,
    <div key="hello">Hello World</div>,
  ]
  const slotsConfig = {
    a: TestComponentA,
    slotComponent: TestComponentWithSlot,
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
            Component A
          </TestComponentA>,
          "slotComponent": <TestComponentWithSlot>
            Slot component
          </TestComponentWithSlot>,
        },
        [
          <WrappedTestComponentA />,
          <div>
            Hello World
          </div>,
        ],
      ],
    ]
  `)
})

test('handles slot symbol matching with duplicate detection', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const children = [
    <TestComponentWithSlot key="first">First slot</TestComponentWithSlot>,
    <WrappedTestComponentWithSlot key="wrapped" />,
    <div key="hello">Hello World</div>,
  ]
  const slotsConfig = {
    slotComponent: TestComponentWithSlot,
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
          "slotComponent": <TestComponentWithSlot>
            First slot
          </TestComponentWithSlot>,
        },
        [
          <div>
            Hello World
          </div>,
        ],
      ],
    ]
  `)
  expect(warnSpy).toHaveBeenCalledTimes(1)
  expect(warnSpy).toHaveBeenCalledWith(
    'Warning:',
    'Found duplicate "slotComponent" slot. Only the first will be rendered.',
  )
})

test('handles empty slot symbols gracefully', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []

  // Component without __SLOT__ property
  function ComponentWithoutSlot(props: React.PropsWithChildren<unknown>) {
    return <div {...props} />
  }

  const children = [
    <ComponentWithoutSlot key="no-slot">No slot</ComponentWithoutSlot>,
    <TestComponentWithSlot key="with-slot">With slot</TestComponentWithSlot>,
    <div key="hello">Hello World</div>,
  ]
  const slotsConfig = {
    slotComponent: TestComponentWithSlot,
    noSlot: ComponentWithoutSlot,
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
          "noSlot": <ComponentWithoutSlot>
            No slot
          </ComponentWithoutSlot>,
          "slotComponent": <TestComponentWithSlot>
            With slot
          </TestComponentWithSlot>,
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
