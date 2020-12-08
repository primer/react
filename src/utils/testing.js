/* eslint-disable jsdoc/require-param, jsdoc/require-returns, jsdoc/require-description-complete-sentence, jsdoc/match-description */
import React from 'react'
import {promisify} from 'util'
import renderer from 'react-test-renderer'
import enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {ThemeProvider} from 'styled-components'
import {default as defaultTheme} from '../theme'

const readFile = promisify(require('fs').readFile)

export const COMPONENT_DISPLAY_NAME_REGEX = /^[A-Z][A-Za-z]+(\.[A-Z][A-Za-z]+)*$/

enzyme.configure({adapter: new Adapter()})

export function mount(component) {
  return enzyme.mount(component)
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
export function render(component) {
  return renderer.create(component).toJSON()
}

/**
 * Render the component (a React.createElement() or JSX expression)
 * using react-test-renderer and return the root node
 * ```
 */
export function renderRoot(component) {
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
export function renderClasses(component) {
  const {
    props: {className},
  } = render(component)
  return className ? className.trim().split(' ') : []
}

/**
 * Returns true if a node renders with a single class.
 */
export function rendersClass(node, klass) {
  return renderClasses(node).includes(klass)
}

export function renderWithTheme(node, theme = defaultTheme) {
  return render(<ThemeProvider theme={theme}>{node}</ThemeProvider>)
}

export function px(value) {
  return typeof value === 'number' ? `${value}px` : value
}

export function percent(value) {
  return typeof value === 'number' ? `${value}%` : value
}

export function renderStyles(node) {
  const {
    props: {className},
  } = render(node)
  return getComputedStyles(className)
}

export function getComputedStyles(className) {
  const div = document.createElement('div')
  div.className = className

  const computed = {}
  for (const sheet of document.styleSheets) {
    for (const rule of sheet.cssRules) {
      if (rule.type === 1) {
        readRule(rule, computed)
      } else if (rule.type === 4) {
        readMedia(rule)
      } else {
        // console.warn('rule.type =', rule.type)
      }
    }
  }

  return computed

  function readRule(rule, dest) {
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

  function readMedia(mediaRule) {
    const key = `@media ${mediaRule.media[0]}`
    // const dest = computed[key] || (computed[key] = {})
    const dest = {}
    for (const rule of mediaRule.cssRules) {
      readRule(rule, dest)
    }

    // Don't add media rule to computed styles
    // if no styles were actually applied
    if (Object.keys(dest).length > 0) {
      computed[key] = dest
    }
  }

  function matchesSafe(node, selector) {
    if (!selector) {
      return false
    }
    try {
      return node.matches(selector)
    } catch (error) {
      return false
    }
  }
}

/**
 * This provides a layer of compatibility between the render() function from
 * react-test-renderer and Enzyme's mount()
 */
export function getProps(node) {
  return typeof node.props === 'function' ? node.props() : node.props
}

export function getClassName(node) {
  return getProps(node).className
}

export function getClasses(node) {
  const className = getClassName(node)
  return className ? className.trim().split(/ +/) : []
}

export function loadCSS(path) {
  return readFile(require.resolve(path), 'utf8').then((css) => {
    const style = document.createElement('style')
    style.setAttribute('data-path', path)
    style.textContent = css
    document.head.appendChild(style)
    return style
  })
}

export function unloadCSS(path) {
  const style = document.querySelector(`style[data-path="${path}"]`)
  if (style) {
    style.remove()
    return true
  }
}

// If a component requires certain props or other conditions in order
// to render without errors, you can pass a `toRender` function that
// returns an element ready to be rendered.
export function behavesAsComponent(Component, systemPropArray, toRender = null, options) {
  if (typeof toRender === 'object' && !options) {
    options = toRender
    toRender = null
  }
  options = options || {}

  const getElement = () => (toRender ? toRender() : <Component />)

  it('implements system props', () => {
    for (const systemProps of systemPropArray) {
      expect(Component).toImplementSystemProps(systemProps)
    }
  })

  if (!options.skipSx) {
    it('implements the sx prop', () => {
      expect(Component).toImplementSxProp()
    })

    it('implements sx prop behavior', () => {
      expect(getElement()).toImplementSxBehavior()
    })
  }

  if (!options.skipAs) {
    it('respects the as prop', () => {
      const As = React.forwardRef((_props, ref) => <div className="as-component" ref={ref} />)
      const elem = React.cloneElement(getElement(), {as: As})
      expect(render(elem)).toEqual(render(<As />))
    })
  }

  it('sets a valid displayName', () => {
    expect(Component.displayName).toMatch(COMPONENT_DISPLAY_NAME_REGEX)
  })

  it('sets the default theme', () => {
    expect(getElement()).toSetDefaultTheme()
  })

  it('renders consistently', () => {
    expect(render(getElement())).toMatchSnapshot()
  })
}

export function checkExports(path, exports) {
  it('has declared exports', () => {
    const mod = require(`../${path}`)
    expect(mod).toSetExports(exports)
  })
}
