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
    a: {type: TestComponentA},
    b: {type: TestComponentB},
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
    a: {type: TestComponentA},
    b: {type: TestComponentB},
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
    a: {type: TestComponentA},
    b: {type: TestComponentB},
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
    a: {type: TestComponentA},
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
        a: {type: TestComponentA, props: (props: TestComponentAProps) => props.variant === 'a'},
        b: {type: TestComponentA, props: (props: TestComponentAProps) => props.variant === 'b'},
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

test('extracts elements with configuration that has only slot property', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []

  // Create components with __SLOT__ prop to match slot configuration
  const SlottedComponentA = (props: React.PropsWithChildren<{__SLOT__?: string}>) => <div {...props} />
  SlottedComponentA.__SLOT__ = 'header'
  const SlottedComponentB = (props: React.PropsWithChildren<{__SLOT__?: string}>) => <span {...props} />
  SlottedComponentB.__SLOT__ = 'footer'

  const children = [
    <SlottedComponentA key="a" __SLOT__="header">
      Header Content
    </SlottedComponentA>,
    <SlottedComponentB key="b" __SLOT__="footer">
      Footer Content
    </SlottedComponentB>,
    <div key="content">Main Content</div>,
  ]

  const slotsConfig = {
    header: {slot: 'header'},
    footer: {slot: 'footer'},
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
          "footer": <SlottedComponentB
            __SLOT__="footer"
          >
            Footer Content
          </SlottedComponentB>,
          "header": <SlottedComponentA
            __SLOT__="header"
          >
            Header Content
          </SlottedComponentA>,
        },
        [
          <div>
            Main Content
          </div>,
        ],
      ],
    ]
  `)
})

test('extracts elements with configuration that has slot and type properties', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []

  // Create components with __SLOT__ prop and specific types
  const HeaderComponent = (props: React.PropsWithChildren<{__SLOT__?: string}>) => <header {...props} />
  HeaderComponent.__SLOT__ = 'header'
  const FooterComponent = (props: React.PropsWithChildren<{__SLOT__?: string}>) => <footer {...props} />
  FooterComponent.__SLOT__ = 'footer'

  const children = [
    <HeaderComponent key="a" __SLOT__="header">
      Header Content
    </HeaderComponent>,
    <FooterComponent key="b" __SLOT__="footer">
      Footer Content
    </FooterComponent>,
    <TestComponentA key="c" />, // This won't match any slot
    <div key="content">Main Content</div>,
  ]

  const slotsConfig = {
    header: {slot: 'header', type: HeaderComponent},
    footer: {slot: 'footer', type: FooterComponent},
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
          "footer": <FooterComponent
            __SLOT__="footer"
          >
            Footer Content
          </FooterComponent>,
          "header": <HeaderComponent
            __SLOT__="header"
          >
            Header Content
          </HeaderComponent>,
        },
        [
          <TestComponentA />,
          <div>
            Main Content
          </div>,
        ],
      ],
    ]
  `)
})

test('extracts elements with configuration that has slot and props properties', () => {
  const calls: Array<ReturnType<typeof useSlots>> = []

  // Create components with __SLOT__ prop and additional props for filtering
  const ContentComponent = (props: React.PropsWithChildren<{priority?: 'high' | 'low'}>) => <div {...props} />
  ContentComponent.__SLOT__ = 'content'

  const SidebarComponent = (props: React.PropsWithChildren<{priority?: 'high' | 'low'}>) => <div {...props} />
  SidebarComponent.__SLOT__ = 'sidebar'

  const children = [
    <ContentComponent key="a" priority="high">
      High Priority Content
    </ContentComponent>,
    <ContentComponent key="b" priority="low">
      Low Priority Content
    </ContentComponent>,
    <SidebarComponent key="c" priority="high">
      High Priority Sidebar
    </SidebarComponent>,
    <div key="other">Other Content</div>,
  ]

  const slotsConfig = {
    highPriorityContent: {
      slot: 'content',
      props: (props: {priority?: 'high' | 'low'}) => props.priority === 'high',
    },
    lowPriorityContent: {
      slot: 'content',
      props: (props: {priority?: 'high' | 'low'}) => props.priority === 'low',
    },
    sidebar: {slot: 'sidebar'},
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
          "highPriorityContent": <ContentComponent
            priority="high"
          >
            High Priority Content
          </ContentComponent>,
          "lowPriorityContent": <ContentComponent
            priority="low"
          >
            Low Priority Content
          </ContentComponent>,
          "sidebar": <SidebarComponent
            priority="high"
          >
            High Priority Sidebar
          </SidebarComponent>,
        },
        [
          <div>
            Other Content
          </div>,
        ],
      ],
    ]
  `)
})
