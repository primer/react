import {describe, expect, it} from 'vitest'
import {readElementTag, simplifyReactType} from '../ts-utils'

// Every input below is a string TypeScript actually produced for a component in
// @primer/react-tailwind, so the boundary is pinned to real output rather than invented shapes.
describe('simplifyReactType', () => {
  it('collapses an opaque element to the name an author writes', () => {
    expect(simplifyReactType('ReactElement<unknown, string | JSXElementConstructor<any>>')).toBe('React.ReactElement')
  })

  it('keeps the props argument of a typed element', () => {
    // Only the opaque form is noise. Flattening this to ReactNode would lose the fact that
    // the element must be a button, which is exactly what the reader needs.
    expect(simplifyReactType('ReactElement<HTMLProps<HTMLButtonElement>, string | JSXElementConstructor<any>>')).toBe(
      'React.ReactElement<HTMLProps<HTMLButtonElement>>',
    )
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

describe('readElementTag', () => {
  it('maps an element interface to its tag', () => {
    expect(readElementTag('HTMLDivElement')).toBe('div')
    expect(readElementTag('HTMLSpanElement')).toBe('span')
    expect(readElementTag('HTMLOptGroupElement')).toBe('optgroup')
    expect(readElementTag('HTMLTimeElement')).toBe('time')
  })

  it('maps an interface to its tag rather than its interface name', () => {
    expect(readElementTag('HTMLAnchorElement')).toBe('a')
    expect(readElementTag('HTMLTableRowElement')).toBe('tr')
    expect(readElementTag('SVGSVGElement')).toBe('svg')
  })

  it('reports nothing for an interface shared by several tags', () => {
    // Reporting one tag for these would be a guess: HTMLElement is every element, and
    // HTMLHeadingElement is h1 through h6.
    expect(readElementTag('HTMLElement')).toBeUndefined()
    expect(readElementTag('HTMLHeadingElement')).toBeUndefined()
    expect(readElementTag('HTMLTableCellElement')).toBeUndefined()
    expect(readElementTag('HTMLTableSectionElement')).toBeUndefined()
  })

  it('reports nothing for a name that is not an element interface', () => {
    expect(readElementTag('ButtonProps')).toBeUndefined()
    expect(readElementTag('constructor')).toBeUndefined()
  })
})
