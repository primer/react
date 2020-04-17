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

function invisibleProp(descriptor) {
  return {
    configurable: false,
    enumerable: false,
    ...descriptor
  }
}

function addDocKeys(checker, isRequired, name, args = []) {
  function newIsRequired(...args) {
    return isRequired(...args)
  }

  Object.defineProperties(checker, {
    doc: invisibleProp({
      value: {
        name,
        hidden: false,
        isRequired: false,
        desc: '',
        args
      }
    }),
    desc: invisibleProp({
      value: desc => {
        checker.doc.desc = desc
        return checker
      }
    }),
    hidden: invisibleProp({
      get() {
        checker.doc.hidden = true
        return checker
      }
    }),
    isRequired: invisibleProp({
      get() {
        checker.doc.isRequired = true
        return newIsRequired
      }
    })
  })

  Object.defineProperties(newIsRequired, {
    doc: invisibleProp({
      get() {
        return checker.doc
      }
    }),
    desc: invisibleProp({
      value: desc => {
        checker.doc.desc = desc
        return newIsRequired
      }
    }),
    hidden: invisibleProp({
      get() {
        checker.doc.hidden = true
        return newIsRequired
      }
    })
  })
}

export function wrapPrimitivePropType(propType, name) {
  const checker = (...args) => propType(...args)
  addDocKeys(checker, propType.isRequired, name)
  return checker
}

export function wrapCallablePropType(propType, name) {
  return function checkerCreator(args) {
    const checker = propType(args)
    addDocKeys(checker, checker.isRequired, name, args)
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

function getPropTypesFromArray(ary, propTypes) {
  return ary.reduce((acc, item) => {
    Object.assign(acc, item[propTypes])
    return acc
  }, {})
}

propTypes.doc = function docPropTypes(spec) {
  const system = spec.system || []
  const inherited = spec.inherited || []
  const own = spec.own || {}

  const finalPropTypes = {
    ...getPropTypesFromArray(system, 'propTypes'),
    ...getPropTypesFromArray(inherited, 'propTypes'),
    ...own
  }

  Object.defineProperty(finalPropTypes, '__doc_spec', {
    configurable: false,
    enumerable: false,
    value: {system, inherited, own}
  })

  return finalPropTypes
}

export {propTypes}
