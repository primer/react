import {createMatchers, createSerializer} from 'jest-emotion'
import * as emotion from 'emotion'
import * as systemProps from 'styled-system'

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
    const pass = only ? this.equals(classes.sort(), klasses.sort()) : klasses.every(klass => classes.includes(klass))
    return {
      pass,
      message: () => `expected ${stringify(classes)} to include: ${stringify(klasses)}`
    }
  },

  toImplementSystemProps(Component, propNames) {
    const missing = propNames.reduce((list, name) => {
      const prop = systemProps[name]
      return list.concat(
        Object.keys(prop.propTypes).filter(type => {
          return !Component.propTypes[type]
        })
      )
    }, [])
    return {
      pass: missing.length === 0,
      message: () => `Missing props: ${missing.join(', ')}`
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
