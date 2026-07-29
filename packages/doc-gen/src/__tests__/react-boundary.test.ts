import {describe, expect, it} from 'vitest'
import {readPassthroughElement, simplifyReactType} from '../ts-utils'

// Every input below is a string TypeScript actually produced for a component in
// @primer/react-tailwind, so the boundary is pinned to real output rather than invented shapes.
describe('simplifyReactType', () => {
  it('collapses an opaque element to the name an author writes', () => {
    expect(simplifyReactType('ReactElement<unknown, string | JSXElementConstructor<any>>')).toBe('React.ReactElement')
  })

  it('collapses a fully expanded node union', () => {
    const expanded =
      'string | number | bigint | boolean | Iterable<ReactNode> | Promise<AwaitedReactNode> | ReactElement<unknown, string | JSXElementConstructor<any>> | ReactPortal | null | undefined'
    expect(simplifyReactType(expanded)).toBe('React.ReactNode')
  })

  it('keeps an element type distinct from a node', () => {
    const expanded =
      'string | number | bigint | boolean | ComponentClass<any, any> | FunctionComponent<any> | Iterable<ReactNode> | ReactElement<unknown, string | JSXElementConstructor<any>> | ReactPortal | null | undefined'
    expect(simplifyReactType(expanded)).toBe('React.ReactNode | React.ElementType')
  })

  it('preserves union members that are not React internals', () => {
    expect(simplifyReactType('SelectPanelMessage | ReactNode')).toBe('SelectPanelMessage | React.ReactNode')
  })

  it('applies the boundary inside a callback return type', () => {
    expect(simplifyReactType('((props: PageProps) => ReactNode)')).toBe('((props: PageProps) => React.ReactNode)')
    expect(
      simplifyReactType(
        '((props: SelectPanelAnchorProps) => ReactElement<unknown, string | JSXElementConstructor<any>>) | null',
      ),
    ).toBe('((props: SelectPanelAnchorProps) => React.ReactElement) | null')
  })

  it('drops default type arguments the checker spells out', () => {
    expect(simplifyReactType('ElementType<any, keyof IntrinsicElements>')).toBe('React.ElementType')
  })

  it('leaves a type with no React boundary untouched', () => {
    expect(simplifyReactType('"small" | "medium" | "large"')).toBe('"small" | "medium" | "large"')
    expect(simplifyReactType('string | number')).toBe('string | number')
    expect(simplifyReactType('boolean | RefObject<HTMLElement | null>')).toBe('boolean | RefObject<HTMLElement | null>')
  })

  it('does not split a union nested inside a generic', () => {
    expect(simplifyReactType('Record<string, string | number>')).toBe('Record<string, string | number>')
  })
})

describe('readPassthroughElement', () => {
  it('reads a tag from ComponentPropsWithoutRef', () => {
    expect(readPassthroughElement("extends React.ComponentPropsWithoutRef<'a'>")).toBe('a')
    expect(readPassthroughElement("extends React.ComponentPropsWithoutRef<'nav'>")).toBe('nav')
    expect(readPassthroughElement("extends React.ComponentPropsWithoutRef<'h2'>")).toBe('h2')
  })

  it('maps an element interface to its tag', () => {
    expect(readPassthroughElement('extends React.HTMLAttributes<HTMLDivElement>')).toBe('div')
    expect(readPassthroughElement('extends React.HTMLAttributes<HTMLSpanElement>')).toBe('span')
  })

  it('maps the anchor interface to its tag rather than its interface name', () => {
    expect(readPassthroughElement('extends React.AnchorHTMLAttributes<HTMLAnchorElement>')).toBe('a')
  })

  it('reports nothing for an interface shared by several tags', () => {
    // Reporting one tag for these would be a guess: HTMLElement is every element, and
    // HTMLHeadingElement is h1 through h6.
    expect(readPassthroughElement('extends React.HTMLAttributes<HTMLElement>')).toBeUndefined()
    expect(readPassthroughElement('extends React.HTMLAttributes<HTMLHeadingElement>')).toBeUndefined()
    expect(readPassthroughElement('extends React.HTMLAttributes<HTMLTableCellElement>')).toBeUndefined()
  })

  it('reports nothing for a component reference', () => {
    expect(readPassthroughElement('extends React.ComponentPropsWithoutRef<typeof Heading>')).toBeUndefined()
    expect(readPassthroughElement('BaseDialog.Root.Props')).toBeUndefined()
  })

  it('reads the element from a type alias body, not only a heritage clause', () => {
    expect(readPassthroughElement('React.HTMLAttributes<HTMLSpanElement>')).toBe('span')
  })
})
