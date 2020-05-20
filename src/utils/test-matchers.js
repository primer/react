import React from 'react'
import 'jest-styled-components'
import {styleSheetSerializer} from 'jest-styled-components/serializer'
import theme from '../theme'
import {getClasses, mount, render} from './testing'

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
    const expectedPropKeys = Object.keys(propNames.propTypes)
    const missing = expectedPropKeys.filter(key => !propKeys.has(key)).filter(key => !ALIAS_PROP_TYPES.includes(key))
    return {
      pass: missing.length === 0,
      message: () => `Missing prop${missing.length === 1 ? '' : 's'}: ${stringify(missing)}`
    }
  },

  toImplementSxProp(Component) {
    return {
      pass: !!Component.propTypes.sx,
      message: () => 'Missing sx propTypes'
    }
  },

  toImplementSxBehavior(element) {
    const sxPropValue = {color: 'LemonChiffon'}
    const elem = React.cloneElement(element, {sx: sxPropValue})
    const rendered = render(elem)

    function checkStyleRuleRecursively(comp) {
      try {
        expect(comp).toHaveStyleRule('color', 'LemonChiffon')
        return true
      } catch (err) {
        // component didn't have style rule, but maybe a child did
        if (comp.children && Array.isArray(comp.children)) {
          const childWithStyleRule = comp.children.find(checkStyleRuleRecursively)
          if (childWithStyleRule) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }
    }

    return {
      pass: checkStyleRuleRecursively(rendered),
      message: () => 'sx prop values did not change styles of component nor of any sub-components'
    }
  },

  toSetDefaultTheme(Component) {
    let comp
    if (Component.type) {
      comp = Component
    } else {
      comp = <Component />
    }
    const wrapper = mount(comp)
    const pass = this.equals(wrapper.prop('theme'), theme)
    return {
      pass,
      message: () => 'default theme is not set'
    }
  },

  toSetExports(mod, expectedExports) {
    if (!Object.keys(expectedExports).includes('default')) {
      return {
        pass: false,
        message: () => "You must specify the module's default export"
      }
    }

    const seen = new Set()
    for (const exp of Object.keys(expectedExports)) {
      seen.add(exp)
      if (mod[exp] !== expectedExports[exp]) {
        if (!mod[exp] && !expectedExports[exp]) {
          continue
        }

        return {
          pass: false,
          message: () => `Module exported a different value from key '${exp}' than expected`
        }
      }
    }

    for (const exp of Object.keys(mod)) {
      if (seen.has(exp)) {
        continue
      }

      if (mod[exp] !== expectedExports[exp]) {
        return {
          pass: false,
          message: () => `Module exported an unexpected value from key '${exp}'`
        }
      }
    }

    return {
      pass: true,
      message: () => ''
    }
  }
})
