import {render} from './testing'
import {createMatchers, createSerializer} from 'jest-emotion'
import * as emotion from 'emotion'

expect.extend(createMatchers(emotion))
expect.addSnapshotSerializer(createSerializer(emotion))

const {stringify} = JSON

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
    const pass = only
      ? this.equals(classes.sort(), klasses.sort())
      : klasses.every(klass => classes.includes(klass))
    return {
      pass,
      message: () => `expected ${stringify(classes)} to include: ${stringify(klasses)}`
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
