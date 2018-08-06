import {createMatchers, createSerializer} from 'jest-emotion'
import * as emotion from 'emotion'
import * as systemProps from 'styled-system'

expect.extend(createMatchers(emotion))
expect.addSnapshotSerializer(createSerializer(emotion))

const stringify = d => JSON.stringify(d, null, '  ')

const ALIAS_PROP_TYPES = [
  'w',
  'align',
  'justify',
  'wrap',
]

expect.extend({
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
      const fn = systemProps[name]
      return list.concat(Object.keys(fn.propTypes))
    }, [])
    const missing = expectedPropKeys
      .filter(key => !propKeys.has(key))
      .filter(key => !ALIAS_PROP_TYPES.includes(key))
    return {
      pass: missing.length === 0,
      message: () => `Missing prop${missing.length === 1 ? '' : 's'}: ${stringify(missing)}`
    }
  }
})

function getProps(node) {
  return typeof node.props === 'function' ? node.props() : node.props
}

function getClasses(node) {
  const {className = ''} = getProps(node)
  return className.trim().split(/ +/)
}
