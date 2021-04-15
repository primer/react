import {Nullish} from '@testing-library/react'
import 'jest-styled-components'
import {styleSheetSerializer} from 'jest-styled-components/serializer'
import React from 'react'
import {ReactTestRendererJSON, ReactTestRendererNode} from 'react-test-renderer'
import {getClasses, getComputedStyles, render} from './testing'

expect.addSnapshotSerializer(styleSheetSerializer)

const stringify = (d: Record<string, unknown>) => JSON.stringify(d, null, '  ')

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
    const pass = only
      ? this.equals(classes.sort(), klasses.sort())
      : klasses.every((klass: Array<string>) => classes.includes(klass))
    return {
      pass,
      message: () => `expected ${stringify(classes)} to include: ${stringify(klasses)}`
    }
  },

  toImplementSxBehavior(element) {
    const mediaKey = '@media (max-width:123px)'
    const sxPropValue = {
      [mediaKey]: {
        color: 'red.5'
      }
    }

    const elem = React.cloneElement(element, {sx: sxPropValue})

    function checkStylesDeep(rendered: ReactTestRendererJSON): boolean {
      const className = rendered?.props ? rendered.props.className : ''
      const styles = getComputedStyles(className)
      const mediaStyles = styles[mediaKey] as Nullish<Record<string, string>>
      if (mediaStyles && mediaStyles.color) {
        return true
      } else if (rendered.children) {
        return rendered.children.some((child: ReactTestRendererNode) => checkStylesDeep(child as ReactTestRendererJSON))
      } else {
        return false
      }
    }

    return {
      pass: checkStylesDeep(render(elem)),
      message: () => 'sx prop values did not change styles of component nor of any sub-components'
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
