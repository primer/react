/* eslint-disable no-console */

const Deprecated = ({componentName, message, version, children}) => {
  console.warn(`WARNING! ${componentName} will be deprecated in version ${version}. ${message}`)
  return children
}

export default Deprecated
