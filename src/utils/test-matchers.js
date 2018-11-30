import 'jest-styled-components'
import {styleSheetSerializer} from 'jest-styled-components/serializer'
import {styles as systemProps} from 'styled-system'
import {getClasses, getClassName, getComputedStyles, render} from './testing'

expect.addSnapshotSerializer(styleSheetSerializer)

const stringify = d => JSON.stringify(d, null, '  ')

/**
 * These are props that styled-system aliases for backwards compatibility.
 * For some reason, they don't show up in our toImplementSystemProps() matcher,
 * so we skip over them.
 */
const ALIAS_PROP_TYPES = ['w', 'align', 'justify', 'wrap']

expect.extend({
  toMatchKeys(obj, values) {
    return {
      pass: Object.keys(values).every(key => this.equals(obj[key], values[key])),
      message: () => `Expected ${stringify(obj)} to have matching keys: ${stringify(values)}`
    }
  },

  toHaveClass(node, klass) {
    const classes = getClasses(node)
    const pass = classes.includes(klass)
    return {
      pass,
      message: () => `expected ${stringify(classes)} to include: ${stringify(klass)}`
    }
  },

  toHaveClasses(node, klasses, only = false) {
    const classes = getClasses(node)
    const pass = only ? this.equals(classes.sort(), klasses.sort()) : klasses.every(klass => classes.includes(klass))
    return {
      pass,
      message: () => `expected ${stringify(classes)} to include: ${stringify(klasses)}`
    }
  },

  toImplementSystemProps(Component, propNames) {
    const propKeys = new Set(Object.keys(Component.propTypes))
    const expectedPropKeys = propNames.reduce((list, name) => {
      const fn = typeof name === 'function' ? name : systemProps[name]
      if (!fn) throw new Error(`"${name}" is not a system prop!!`)
      return list.concat(Object.keys(fn.propTypes))
    }, [])
    const missing = expectedPropKeys.filter(key => !propKeys.has(key)).filter(key => !ALIAS_PROP_TYPES.includes(key))
    return {
      pass: missing.length === 0,
      message: () => `Missing prop${missing.length === 1 ? '' : 's'}: ${stringify(missing)}`
    }
  },

  toRenderStyles(node, expected) {
    const result = render(node)
    const className = getClassName(result)
    const computed = getComputedStyles(className)
    return {
      pass: this.equals(expected, computed),
      message: () => `Computed styles mismatch: expected ${stringify(expected)}, but got ${stringify(computed)}`
    }
  }
})
