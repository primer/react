import {createMatchers, createSerializer} from 'jest-emotion'
import * as emotion from 'emotion'
import {styles as systemProps} from 'styled-system'
import {render} from './testing'

expect.extend(createMatchers(emotion))
expect.addSnapshotSerializer(createSerializer(emotion))

const stringify = d => JSON.stringify(d, null, '  ')

/**
 * These are props that styled-system aliases for backwards compatibility.
 * For some reason, they don't show up in our toImplementSystemProps() matcher,
 * so we skip over them.
 */
const ALIAS_PROP_TYPES = ['w', 'align', 'justify', 'wrap']

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
    const missing = expectedPropKeys.filter(key => !propKeys.has(key)).filter(key => !ALIAS_PROP_TYPES.includes(key))
    return {
      pass: missing.length === 0,
      message: () => `Missing prop${missing.length === 1 ? '' : 's'}: ${stringify(missing)}`
    }
  },

  toRenderStyles(node, expected) {
    const result = render(node)
    const classes = getClasses(result)
    const computed = getComputedStyles(classes)
    return {
      pass: this.equals(expected, computed),
      message: () => `Computed styles mismatch: expected ${stringify(expected)}, but got ${stringify(computed)}`
    }
  }
})

/**
 * This provides a layer of compatibility between the render() function from
 * react-test-renderer and Enzyme's mount()
 */
function getProps(node) {
  return typeof node.props === 'function' ? node.props() : node.props
}

function getClasses(node) {
  const {className} = getProps(node)
  return className ? className.trim().split(/ +/) : []
}

function getComputedStyles(classes) {
  const pattern = new RegExp(`\\.(${classes.join('|')})\\b`)
  const computed = {}
  for (const sheet of document.styleSheets) {
    for (const rule of sheet.cssRules) {
      if (rule.type === 1) {
        readRule(rule, computed)
      } else if (rule.type === 4) {
        readMedia(rule)
      } else {
        console.warn('rule.type =', rule.type)
      }
    }
  }

  return computed

  function readRule(rule, dest) {
    if (!rule.selectorText) {
      // console.warn('no selector text:', rule)
    } else if (rule.selectorText.match(pattern)) {
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
    const dest = computed[key] || (computed[key] = {})
    for (const rule of mediaRule.cssRules) {
      readRule(rule, dest)
    }
  }
}
