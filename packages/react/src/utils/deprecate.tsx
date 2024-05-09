import {useRef, useCallback} from 'react'

type DeprecationType = {name: string; message: string; version: string}

const noop = () => {}
// eslint-disable-next-line import/no-mutable-exports
let deprecate: ({name, message, version}: DeprecationType) => void | (() => void) = noop

if (__DEV__) {
  deprecate = ({name, message, version}: DeprecationType) => {
    Deprecations.deprecate({name, message, version})
  }
}

export {deprecate}

// eslint-disable-next-line import/no-mutable-exports
let useDeprecation = null

if (__DEV__) {
  useDeprecation = ({name, message, version}: DeprecationType) => {
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
  static instance: Deprecations | null = null
  deprecations: Array<DeprecationType>

  static get() {
    if (!Deprecations.instance) {
      Deprecations.instance = new Deprecations()
    }

    return Deprecations.instance
  }

  constructor() {
    this.deprecations = []
  }

  static deprecate({name, message, version}: DeprecationType) {
    const msg = `WARNING! ${name} is deprecated and will be removed in version ${version}. ${message}`
    // eslint-disable-next-line no-console
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
