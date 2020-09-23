/* eslint-disable no-console */
import {useRef, useCallback} from 'react'

const noop = () => {}
// eslint-disable-next-line import/no-mutable-exports
let deprecate = null

if (__DEV__) {
  deprecate = ({name, message, version}) => {
    Deprecations.deprecate({name, message, version})
  }
} else {
  deprecate = noop
}

export {deprecate}

// eslint-disable-next-line import/no-mutable-exports
let useDeprecation = null

if (__DEV__) {
  useDeprecation = ({name, message, version}) => {
    const ref = useRef(false)
    const logDeprecation = useCallback(() => {
      if (!ref.current) {
        ref.current = true
        deprecate({name, message, version})
      }
    }, [name, message, version])

    return logDeprecation
  }
} else {
  useDeprecation = () => {
    return noop
  }
}

export {useDeprecation}

export class Deprecations {
  static get() {
    if (!Deprecations.instance) {
      Deprecations.instance = new Deprecations()
    }

    return Deprecations.instance
  }

  constructor() {
    this.deprecations = []
  }

  static deprecate({name, message, version}) {
    const msg = `WARNING! ${name} is deprecated and will be removed in version ${version}. ${message}`
    console.warn(msg)

    this.get().deprecations.push({name, message, version})
  }

  static getDeprecations() {
    return this.get().deprecations
  }

  static clearDeprecations() {
    this.get().deprecations.length = 0
  }
}
