import {version} from 'react'

/**
 * Indicate whether current execution environment can access the DOM.
 *
 * @see https://github.com/facebook/fbjs/blob/4d1751311d3f67af2dcce2e40df8512a23c7b9c6/packages/fbjs/src/core/ExecutionEnvironment.js#L12
 */
const canUseDOM = (() => {
  if (typeof window === 'undefined') {
    return false
  }

  return typeof (window as unknown as {document?: {createElement?: unknown}}).document?.createElement === 'function'
})()

// Grab the major version from react. This could be formatted as any valid
// semver version, e.g.:
//
// - 19.0.0
// - 19.0.0-rc.1
// - 0.0.0-{channel}-{commit}-{time}
//
// So we only pull the first part of the version and parse it.
const reactVersion = version.split('.')
const reactMajorVersion = parseInt(reactVersion[0], 10)

export {canUseDOM, reactMajorVersion}
