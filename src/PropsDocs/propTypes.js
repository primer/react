import PropTypes from 'prop-types'

function proxyPropTypes(target, wrapper, names) {
  for (const name of names) {
    Object.defineProperty(target, name, {
      configurable: false,
      enumerable: true,
      get() {
        return wrapper(PropTypes[name], name)
      }
    })
  }
}

function addDocKeys(checker, isRequired, name, args = []) {
  function newIsRequired(...args) {
    return isRequired(...args)
  }

  Object.defineProperties(checker, {
    doc: {
      configurable: false,
      enumerable: false,
      value: {
        name,
        hidden: false,
        isRequired: false,
        desc: '',
        args
      }
    },
    desc: {
      configurable: false,
      enumerable: false,
      value: desc => {
        checker.doc.desc = desc
        return checker
      }
    },
    hidden: {
      configurable: false,
      enumerable: false,
      get() {
        checker.doc.hidden = true
        return checker
      }
    },
    isRequired: {
      configurable: false,
      enumerable: false,
      value: newIsRequired
    }
  })

  Object.defineProperties(newIsRequired, {
    doc: {
      configurable: false,
      enumerable: false,
      get() {
        return checker.doc
      }
    },
    desc: {
      configurable: false,
      enumerable: false,
      value: desc => {
        checker.doc.desc = desc
        return newIsRequired
      }
    },
    hidden: {
      configurable: false,
      enumerable: false,
      get() {
        checker.doc.hidden = true
        return newIsRequired
      }
    }
  })
}

export function wrapPrimitivePropType(propType, name) {
  const checker = (...args) => propType(...args)
  const origIsRequired = propType.isRequired
  addDocKeys(checker, origIsRequired, name)
  return checker
}

export function wrapCallablePropType(propType, name) {
  return function checkerCreator(args) {
    const checker = propType(args)
    const origIsRequired = checker.isRequired
    addDocKeys(checker, origIsRequired, name, args)
    return checker
  }
}

const propTypes = {}

proxyPropTypes(propTypes, wrapPrimitivePropType, [
  'any',
  'array',
  'bool',
  'func',
  'number',
  'object',
  'string',
  'symbol',
  'node',
  'element',
  'elementType'
])
proxyPropTypes(propTypes, wrapCallablePropType, [
  'instanceOf',
  'arrayOf',
  'oneOf',
  'oneOfType',
  'objectOf',
  'shape',
  'exact'
])

export {propTypes}
