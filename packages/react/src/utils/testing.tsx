import React from 'react'
import {promisify} from 'util'
import renderer from 'react-test-renderer'
import {render as HTMLRender} from '@testing-library/react'
import type {StoryFn} from '@storybook/react'
import axe from 'axe-core'
import customRules from '@github/axe-github'
import {ThemeProvider} from '..'
import {default as defaultTheme} from '../theme'

type ComputedStyles = Record<string, string | Record<string, string>>

// eslint-disable-next-line @typescript-eslint/no-var-requires
const readFile = promisify(require('fs').readFile)

export const COMPONENT_DISPLAY_NAME_REGEX = /^[A-Z][A-Za-z]+(\.[A-Z][A-Za-z]+)*$/

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R> {
      toImplementSxBehavior: () => boolean
      toSetExports: (exports: Record<string, string>) => boolean
      toHaveNoViolations: () => boolean
    }
  }
}

/**
 * Render the component (a React.createElement() or JSX expression)
 * into its intermediate object representation with 'type',
 * 'props', and 'children' keys
 *
 * The returned object can be matched with expect().toEqual(), e.g.
 *
 * ```js
 * expect(render(<Foo />)).toEqual(render(<div foo='bar' />))
 * ```
 */
export function render(component: React.ReactElement, theme = defaultTheme) {
  return renderer
    .create(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
    .toJSON() as renderer.ReactTestRendererJSON
}

/**
 * Render the component (a React.createElement() or JSX expression)
 * using react-test-renderer and return the root node
 * ```
 */
export function renderRoot(component: React.ReactElement) {
  return renderer.create(component).root
}

/**
 * Get the HTML class names rendered by the component instance
 * as an array.
 *
 * ```js
 * expect(renderClasses(<div className='a b' />))
 *   .toEqual(['a', 'b'])
 * ```
 */
export function renderClasses(component: React.ReactElement): string {
  const {
    props: {className},
  } = render(component)
  return className ? className.trim().split(' ') : []
}

/**
 * Returns true if a node renders with a single class.
 */
export function rendersClass(node: React.ReactElement, klass: string): boolean {
  return renderClasses(node).includes(klass)
}

export function px(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

export function percent(value: number | string): string {
  return typeof value === 'number' ? `${value}%` : value
}

export function renderStyles(node: React.ReactElement) {
  const {
    props: {className},
  } = render(node)
  return getComputedStyles(className)
}

export function getComputedStyles(className: string) {
  const div = document.createElement('div')
  div.className = className

  const computed: ComputedStyles = {}
  for (const sheet of document.styleSheets) {
    // CSSRulesLists assumes every rule is a CSSRule, not a CSSStyleRule
    for (const rule of sheet.cssRules) {
      if (rule instanceof CSSMediaRule) {
        readMedia(rule)
      } else if (rule instanceof CSSStyleRule) {
        readRule(rule, computed)
      } else {
        // console.warn('rule.type =', rule.type)
      }
    }
  }

  return computed

  function matchesSafe(node: HTMLDivElement, selector: string) {
    if (!selector) {
      return false
    }
    try {
      return node.matches(selector)
    } catch (error) {
      return false
    }
  }

  function readRule(rule: CSSStyleRule, dest: ComputedStyles) {
    if (matchesSafe(div, rule.selectorText)) {
      const {style} = rule
      for (let i = 0; i < style.length; i++) {
        const prop = style[i]
        dest[prop] = style.getPropertyValue(prop)
      }
    } else {
      // console.warn('no match:', rule.selectorText)
    }
  }

  function readMedia(mediaRule: CSSMediaRule) {
    const key = `@media ${mediaRule.media[0]}`
    // const dest = computed[key] || (computed[key] = {})
    const dest = {}
    for (const rule of mediaRule.cssRules) {
      if (rule instanceof CSSStyleRule) {
        readRule(rule, dest)
      }
    }

    // Don't add media rule to computed styles
    // if no styles were actually applied
    if (Object.keys(dest).length > 0) {
      computed[key] = dest
    }
  }
}
/**
 * This provides a layer of compatibility between the render() function from
 * react-test-renderer and Enzyme's mount()
 */
export function getProps(node: React.ReactElement) {
  return typeof node.props === 'function' ? node.props() : node.props
}

export function getClassName(node: React.ReactElement) {
  return getProps(node).className
}

export function getClasses(node: React.ReactElement) {
  const className = getClassName(node)
  return className ? className.trim().split(/ +/) : []
}

export async function loadCSS(path: string) {
  const css = await readFile(require.resolve(path), 'utf8')
  const style = document.createElement('style')
  style.setAttribute('data-path', path)
  style.textContent = css
  document.head.appendChild(style)
  return style
}

export function unloadCSS(path: string) {
  const style = document.querySelector(`style[data-path="${path}"]`)
  if (style) {
    style.remove()
    return true
  }
}

// If a component requires certain props or other conditions in order
// to render without errors, you can pass a `toRender` function that
// returns an element ready to be rendered.

interface Options {
  skipAs?: boolean
  skipSx?: boolean
}

interface BehavesAsComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<React.PropsWithChildren<any>>
  toRender?: () => React.ReactElement
  options?: Options
}

export function behavesAsComponent({Component, toRender, options}: BehavesAsComponent) {
  options = options || {}

  const getElement = () => (toRender ? toRender() : <Component />)

  if (!options.skipSx) {
    it('implements sx prop behavior', () => {
      expect(getElement()).toImplementSxBehavior()
    })
  }

  if (!options.skipAs) {
    it('respects the as prop', () => {
      const As = React.forwardRef<HTMLDivElement>((_props, ref) => <div className="as-component" ref={ref} />)
      const elem = React.cloneElement(getElement(), {as: As})
      expect(render(elem)).toEqual(render(<As />))
    })
  }

  it('sets a valid displayName', () => {
    expect(Component.displayName).toMatch(COMPONENT_DISPLAY_NAME_REGEX)
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkExports(path: string, exports: Record<any, any>): void {
  it('has declared exports', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(`../${path}`)
    expect(mod).toSetExports(exports)
  })
}

axe.configure(customRules)

export function checkStoriesForAxeViolations(name: string, storyDir?: string) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const stories = require(`${storyDir || '../stories/'}${name}.stories`)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- _meta
  const {default: _meta, ...Stories} = stories
  Object.values(Stories).map(Story => {
    if (typeof Story !== 'function') return
    const StoryComponent = Story as StoryFn
    const {storyName, name: StoryFunctionName} = StoryComponent

    beforeEach(() => {
      // IntersectionObserver isn't available in test environment
      const mockIntersectionObserver = jest.fn()
      mockIntersectionObserver.mockReturnValue({
        observe: () => null,
        unobserve: () => null,
        disconnect: () => null,
      })
      window.IntersectionObserver = mockIntersectionObserver
    })

    it(`story ${storyName || StoryFunctionName} should have no axe violations`, async () => {
      const {container} = HTMLRender(
        <ThemeProvider theme={defaultTheme}>
          <StoryComponent />
        </ThemeProvider>,
      )

      const results = await axe.run(container)
      expect(results).toHaveNoViolations()
    })
  })
}
